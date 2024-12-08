import type { FileEntity } from "@/components/base/file-uploader/types";
import { getProcessedFiles } from "@/components/base/file-uploader/utils";
import { ssePost } from "@/service/base";
import { useCallback, useRef, useState } from "react";
import { getProcessedInputs } from "./utils";

type GetAbortController = (abortController: AbortController) => void;
type SendCallback = {
  onGetConversationMessages?: (conversationId: string, getAbortController: GetAbortController) => Promise<any>;
  onGetSuggestedQuestions?: (responseItemId: string, getAbortController: GetAbortController) => Promise<any>;
  onConversationComplete?: (conversationId: string) => void;
  isPublicAPI?: boolean;
};

import useTimestamp from "@/hooks/use-timestamp";
import { produce } from "immer";
import { useParams, usePathname } from "next/navigation";

import type { ChatConfig, ChatItem, InputForm, Inputs } from "./type";

import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { TransferMethod } from "./type";
const chain = new RemoteRunnable({
  url: "http://localhost:3000/api/",
  options: {
    timeout: 5 * 60 * 1000,
  },
});
export const useExecute = (
  config?: ChatConfig,
  formSettings?: {
    inputs: Inputs;
    inputsForm: InputForm[];
  },
  prevChatList?: ChatItem[],
  stopExecute?: (taskId: string) => void,
  onCompleted?: () => void,
) => {
  const [suggestedQuestions, setSuggestQuestions] = useState<string[]>([]);

  const isRespondingRef = useRef(false);
  const hasStopResponded = useRef(false);
  const [isResponding, setIsResponding] = useState(false);
  const conversationId = useRef("");
  const params = useParams();
  const pathname = usePathname();
  const { formatTime } = useTimestamp();

  const chatListRef = useRef<ChatItem[]>(prevChatList || []);

  const [chatList, setChatList] = useState<ChatItem[]>(prevChatList || []);
  const taskIdRef = useRef("");
  const conversationMessagesAbortControllerRef = useRef<AbortController | null>(null);
  const suggestedQuestionsAbortControllerRef = useRef<AbortController | null>(null);

  const handleUpdateChatList = useCallback((newChatList: ChatItem[]) => {
    setChatList(newChatList);
    chatListRef.current = newChatList;
  }, []);

  const handleResponding = useCallback((isResponding: boolean) => {
    setIsResponding(isResponding);
    isRespondingRef.current = isResponding;
  }, []);

  const handleStop = useCallback(() => {
    hasStopResponded.current = true;
    handleResponding(false);
    if (stopExecute && taskIdRef.current) stopExecute(taskIdRef.current);
    if (conversationMessagesAbortControllerRef.current) conversationMessagesAbortControllerRef.current.abort();
    if (suggestedQuestionsAbortControllerRef.current) suggestedQuestionsAbortControllerRef.current.abort();
  }, [stopExecute, handleResponding]);

  const handleRestart = useCallback(() => {
    conversationId.current = "";
    taskIdRef.current = "";
    handleStop();
    const newChatList = config?.opening_statement
      ? [
          {
            id: `${Date.now()}`,
            content: config.opening_statement,
            isAnswer: true,
            isOpeningStatement: true,
            suggestedQuestions: config.suggested_questions,
          },
        ]
      : [];
    handleUpdateChatList(newChatList);
    setSuggestQuestions([]);
  }, [config, handleStop, handleUpdateChatList]);

  const updateCurrentQA = useCallback(
    ({
      responseItem,
      questionId,
      placeholderAnswerId,
      questionItem,
    }: {
      responseItem: ChatItem;
      questionId: string;
      placeholderAnswerId: string;
      questionItem: ChatItem;
    }) => {
      const newListWithAnswer = produce(
        chatListRef.current.filter((item) => item.id !== responseItem.id && item.id !== placeholderAnswerId),
        (draft) => {
          if (!draft.find((item) => item.id === questionId)) draft.push({ ...questionItem });

          draft.push({ ...responseItem });
        },
      );
      handleUpdateChatList(newListWithAnswer);
    },
    [handleUpdateChatList],
  );

  const handleSend = useCallback(
    async (
      url: string,
      data: {
        query: string;
        files?: FileEntity[];
        [key: string]: any;
      },
      { onGetConversationMessages, onGetSuggestedQuestions, onConversationComplete, isPublicAPI }: SendCallback,
    ) => {
      setSuggestQuestions([]);
      if (isRespondingRef.current) {
        return false;
      }

      const questionId = `question-${Date.now()}`;
      const questionItem = {
        id: questionId,
        content: data.query,
        isAnswer: false,
        message_files: data.files,
      };

      const placeholderAnswerId = `answer-placeholder-${Date.now()}`;
      const placeholderAnswerItem = {
        id: placeholderAnswerId,
        content: "",
        isAnswer: true,
      };

      // const newList = [...chatListRef.current, questionItem, placeholderAnswerItem]
      const newList = [questionItem, placeholderAnswerItem];
      handleUpdateChatList(newList);

      // answer
      const responseItem: ChatItem = {
        id: placeholderAnswerId,
        content: "",
        agent_thoughts: [],
        message_files: [],
        isAnswer: true,
      };

      handleResponding(true);
      hasStopResponded.current = false;

      const { query, files, inputs, ...restData } = data;
      const bodyParams = {
        response_mode: "streaming",
        conversation_id: conversationId.current,
        files: getProcessedFiles(files || []),
        query,
        inputs: getProcessedInputs(inputs || {}, formSettings?.inputsForm || []),
        ...restData,
      };
      if (bodyParams?.files?.length) {
        bodyParams.files = bodyParams.files.map((item) => {
          if (item.transfer_method === TransferMethod.local_file) {
            return {
              ...item,
              url: "",
            };
          }
          return item;
        });
      }

      const isAgentMode = false;
      const hasSetResponseId = false;

      let ttsUrl = "";
      let ttsIsPublic = false;
      if (params.token) {
        ttsUrl = "/text-to-audio";
        ttsIsPublic = true;
      } else if (params.appId) {
        if (pathname.search("explore/installed") > -1) ttsUrl = `/installed-apps/${params.appId}/text-to-audio`;
        else ttsUrl = `/apps/${params.appId}/text-to-audio`;
      }

      // const stream = await chain.streamEvents(bodyParams, {
      //   version: "v2",
      //   // encoding: "text/event-stream",
      // });

      // for await (const event of stream) {
      //   console.log("***************", event);
      // }
      // const player = AudioPlayerManager.getInstance().getAudioPlayer(
      //   ttsUrl,
      //   ttsIsPublic,
      //   uuidV4(),
      //   "none",
      //   "none",
      //   (_: any): any => {},
      // );
      ssePost(
        url,
        {
          body: bodyParams,
        },
        {
          isPublicAPI,
          onData: (
            message: string,
            isFirstMessage: boolean,
            { conversationId: newConversationId, messageId, taskId }: any,
          ) => {
            if (!isAgentMode) {
              responseItem.content = responseItem.content + message;
            } else {
              const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1];
              if (lastThought) lastThought.thought = lastThought.thought + message; // need immer setAutoFreeze
            }

            if (messageId && !hasSetResponseId) {
              responseItem.id = messageId;
              hasSetResponseId = true;
            }

            if (isFirstMessage && newConversationId) conversationId.current = newConversationId;

            taskIdRef.current = taskId;
            if (messageId) responseItem.id = messageId;

            updateCurrentQA({
              responseItem,
              questionId,
              placeholderAnswerId,
              questionItem,
            });
          },
          async onCompleted(hasError?: boolean) {
            handleResponding(false);
            if (onCompleted) onCompleted();

            if (hasError) return;

            if (onConversationComplete) onConversationComplete(conversationId.current);

            if (conversationId.current && !hasStopResponded.current && onGetConversationMessages) {
              const { data }: any = await onGetConversationMessages(
                conversationId.current,
                (newAbortController) => (conversationMessagesAbortControllerRef.current = newAbortController),
              );
              const newResponseItem = data.find((item: any) => item.id === responseItem.id);
              if (!newResponseItem) return;

              const newChatList = produce(chatListRef.current, (draft) => {
                const index = draft.findIndex((item) => item.id === responseItem.id);
                if (index !== -1) {
                  const question = draft[index - 1];
                  draft[index - 1] = {
                    ...question,
                  };
                  draft[index] = {
                    ...draft[index],
                    content: newResponseItem.answer,
                    log: [
                      ...newResponseItem.message,
                      ...(newResponseItem.message[newResponseItem.message.length - 1].role !== "assistant"
                        ? [
                            {
                              role: "assistant",
                              text: newResponseItem.answer,
                              files:
                                newResponseItem.message_files?.filter((file: any) => file.belongs_to === "assistant") ||
                                [],
                            },
                          ]
                        : []),
                    ],
                    more: {
                      time: formatTime(newResponseItem.created_at, "hh:mm A"),
                      tokens: newResponseItem.answer_tokens + newResponseItem.message_tokens,
                      latency: newResponseItem.provider_response_latency.toFixed(2),
                    },
                    // for agent log
                    conversationId: conversationId.current,
                    input: {
                      inputs: newResponseItem.inputs,
                      query: newResponseItem.query,
                    },
                  };
                }
              });
              handleUpdateChatList(newChatList);
            }
            if (
              config?.suggested_questions_after_answer?.enabled &&
              !hasStopResponded.current &&
              onGetSuggestedQuestions
            ) {
              try {
                const { data }: any = await onGetSuggestedQuestions(
                  responseItem.id,
                  (newAbortController) => (suggestedQuestionsAbortControllerRef.current = newAbortController),
                );
                setSuggestQuestions(data);
              } catch (e) {
                setSuggestQuestions([]);
              }
            }
          },
          onFile(file) {
            const lastThought = responseItem.agent_thoughts?.[responseItem.agent_thoughts?.length - 1];
            if (lastThought)
              responseItem.agent_thoughts![responseItem.agent_thoughts!.length - 1].message_files = [
                ...(lastThought as any).message_files,
                file,
              ];

            updateCurrentQA({
              responseItem,
              questionId,
              placeholderAnswerId,
              questionItem,
            });
          },
          onThought(thought) {
            isAgentMode = true;
            const response = responseItem as any;
            if (thought.message_id && !hasSetResponseId) response.id = thought.message_id;
            if (response.agent_thoughts.length === 0) {
              response.agent_thoughts.push(thought);
            } else {
              const lastThought = response.agent_thoughts[response.agent_thoughts.length - 1];
              // thought changed but still the same thought, so update.
              if (lastThought.id === thought.id) {
                thought.thought = lastThought.thought;
                thought.message_files = lastThought.message_files;
                responseItem.agent_thoughts![response.agent_thoughts.length - 1] = thought;
              } else {
                responseItem.agent_thoughts!.push(thought);
              }
            }
            updateCurrentQA({
              responseItem,
              questionId,
              placeholderAnswerId,
              questionItem,
            });
          },
          onMessageEnd: (messageEnd) => {
            if (messageEnd.metadata?.annotation_reply) {
              responseItem.id = messageEnd.id;
              responseItem.annotation = {
                id: messageEnd.metadata.annotation_reply.id,
                authorName: messageEnd.metadata.annotation_reply.account.name,
              };
              const baseState = chatListRef.current.filter(
                (item) => item.id !== responseItem.id && item.id !== placeholderAnswerId,
              );
              const newListWithAnswer = produce(baseState, (draft) => {
                if (!draft.find((item) => item.id === questionId)) draft.push({ ...questionItem });

                draft.push({
                  ...responseItem,
                });
              });
              handleUpdateChatList(newListWithAnswer);
              return;
            }
            responseItem.citation = messageEnd.metadata?.retriever_resources || [];
            const processedFilesFromResponse = getProcessedFilesFromResponse(messageEnd.files || []);
            responseItem.allFiles = uniqBy(
              [...(responseItem.allFiles || []), ...(processedFilesFromResponse || [])],
              "id",
            );

            const newListWithAnswer = produce(
              chatListRef.current.filter((item) => item.id !== responseItem.id && item.id !== placeholderAnswerId),
              (draft) => {
                if (!draft.find((item) => item.id === questionId)) draft.push({ ...questionItem });

                draft.push({ ...responseItem });
              },
            );
            handleUpdateChatList(newListWithAnswer);
          },
          onMessageReplace: (messageReplace) => {
            responseItem.content = messageReplace.answer;
          },
          onError() {
            handleResponding(false);
            const newChatList = produce(chatListRef.current, (draft) => {
              draft.splice(
                draft.findIndex((item) => item.id === placeholderAnswerId),
                1,
              );
            });
            handleUpdateChatList(newChatList);
          },
          onWorkflowStarted: ({ workflow_run_id, task_id }) => {
            taskIdRef.current = task_id;
            responseItem.workflow_run_id = workflow_run_id;
            responseItem.workflowProcess = {
              status: WorkflowRunningStatus.Running,
              tracing: [],
            };
            handleUpdateChatList(
              produce(chatListRef.current, (draft) => {
                const currentIndex = draft.findIndex((item) => item.id === responseItem.id);
                draft[currentIndex] = {
                  ...draft[currentIndex],
                  ...responseItem,
                };
              }),
            );
          },
          onWorkflowFinished: ({ data }) => {
            responseItem.workflowProcess!.status = data.status as WorkflowRunningStatus;
            handleUpdateChatList(
              produce(chatListRef.current, (draft) => {
                const currentIndex = draft.findIndex((item) => item.id === responseItem.id);
                draft[currentIndex] = {
                  ...draft[currentIndex],
                  ...responseItem,
                };
              }),
            );
          },
          onIterationStart: ({ data }) => {
            responseItem.workflowProcess!.tracing!.push({
              ...data,
              status: WorkflowRunningStatus.Running,
            } as any);
            handleUpdateChatList(
              produce(chatListRef.current, (draft) => {
                const currentIndex = draft.findIndex((item) => item.id === responseItem.id);
                draft[currentIndex] = {
                  ...draft[currentIndex],
                  ...responseItem,
                };
              }),
            );
          },
          onIterationFinish: ({ data }) => {
            const tracing = responseItem.workflowProcess!.tracing!;
            const iterationIndex = tracing.findIndex(
              (item) =>
                item.node_id === data.node_id &&
                (item.execution_metadata?.parallel_id === data.execution_metadata?.parallel_id ||
                  item.parallel_id === data.execution_metadata?.parallel_id),
            )!;
            tracing[iterationIndex] = {
              ...tracing[iterationIndex],
              ...data,
              status: WorkflowRunningStatus.Succeeded,
            } as any;

            handleUpdateChatList(
              produce(chatListRef.current, (draft) => {
                const currentIndex = draft.findIndex((item) => item.id === responseItem.id);
                draft[currentIndex] = {
                  ...draft[currentIndex],
                  ...responseItem,
                };
              }),
            );
          },
          onNodeStarted: ({ data }) => {
            if (data.iteration_id) return;

            responseItem.workflowProcess!.tracing!.push({
              ...data,
              status: WorkflowRunningStatus.Running,
            } as any);
            handleUpdateChatList(
              produce(chatListRef.current, (draft) => {
                const currentIndex = draft.findIndex((item) => item.id === responseItem.id);
                draft[currentIndex] = {
                  ...draft[currentIndex],
                  ...responseItem,
                };
              }),
            );
          },
          onNodeFinished: ({ data }) => {
            if (data.iteration_id) return;

            const currentIndex = responseItem.workflowProcess!.tracing!.findIndex((item) => {
              if (!item.execution_metadata?.parallel_id) return item.node_id === data.node_id;

              return (
                item.node_id === data.node_id &&
                item.execution_metadata?.parallel_id === data.execution_metadata.parallel_id
              );
            });
            responseItem.workflowProcess!.tracing[currentIndex] = data as any;
            handleUpdateChatList(
              produce(chatListRef.current, (draft) => {
                const currentIndex = draft.findIndex((item) => item.id === responseItem.id);
                draft[currentIndex] = {
                  ...draft[currentIndex],
                  ...responseItem,
                };
              }),
            );
          },
          onTTSChunk: (messageId: string, audio: string) => {
            if (!audio || audio === "") return;
            // player.playAudioWithAudio(audio, true)
            // AudioPlayerManager.getInstance().resetMsgId(messageId)
          },
          onTTSEnd: (messageId: string, audio: string) => {
            // player.playAudioWithAudio(audio, false)
          },
        },
      );
      return true;
    },
    [],
  );

  return {
    chatList,
    chatListRef,
    handleUpdateChatList,
    conversationId: conversationId.current,
    isResponding,
    setIsResponding,
    handleSend,
    suggestedQuestions,
    handleRestart,
    handleStop,
    // handleAnnotationEdited,
    // handleAnnotationAdded,
    // handleAnnotationRemoved,
  };
};
