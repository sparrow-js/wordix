import { observer } from "mobx-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";

import useStores from "@/hooks/useStores";
import { useParams } from "next/navigation";

import Chat from "@/components/settings/execute/chat";
import { useExecute } from "@/components/settings/execute/hooks";
import type { ChatConfig, ChatItem, OnSend } from "@/components/settings/execute/type";

import { getLastAnswer } from "../utils";

type DebugWithSingleModelProps = {
  checkCanSend?: () => boolean;
  injectChatList?: any[];
};
export type DebugWithSingleModelRefType = {
  handleRestart: () => void;
};
const DebugExecute = forwardRef<DebugWithSingleModelRefType, DebugWithSingleModelProps>(
  ({ checkCanSend, injectChatList }, ref) => {
    const { execute, documents, prompts } = useStores();

    const { id, collectionId } = useParams<{ id: string; collectionId: string }>();

    const config = {
      more_like_this: {},
      opening_statement: "",
      suggested_questions: [],
      sensitive_word_avoidance: {
        enabled: true,
      },
      speech_to_text: {
        enabled: true,
      },
      text_to_speech: {
        enabled: true,
      },
      suggested_questions_after_answer: {
        enabled: true,
      },
      retriever_resource: {
        enabled: true,
      },
      // annotation_reply: features.annotationReply,
    } as ChatConfig;

    // const config = useMemo(() => {
    //   return {
    //     more_like_this: features.moreLikeThis,
    //     opening_statement: features.opening?.enabled ? (features.opening?.opening_statement || '') : '',
    //     suggested_questions: features.opening?.enabled ? (features.opening?.suggested_questions || []) : [],
    //     sensitive_word_avoidance: features.moderation,
    //     speech_to_text: features.speech2text,
    //     text_to_speech: features.text2speech,
    //     file_upload: features.file,
    //     suggested_questions_after_answer: features.suggested,
    //     retriever_resource: features.citation,
    //     annotation_reply: features.annotationReply,
    //   } as ChatConfig
    // }, [features])

    const appId = "";

    const {
      chatList,
      chatListRef,
      isResponding,
      handleSend,
      suggestedQuestions,
      handleStop,
      handleUpdateChatList,
      handleRestart,
    } = useExecute(
      config,
      {
        inputs: execute.inputs,
        inputsForm: [],
      },
      [],
      (taskId) => () => taskId,
      () => {
        execute.setStatus("end");
      },
    );

    const completionParams = {};
    const modelConfig = {
      provider: "",
      model_id: "",
      mode: "",
    };

    const doSend: OnSend = useCallback(
      (message, files, last_answer) => {
        if (checkCanSend && !checkCanSend()) return;

        if (injectChatList) {
          return;
        }

        const configData = {
          ...config,
          model: {
            provider: modelConfig.provider,
            name: modelConfig.model_id,
            mode: modelConfig.mode,
            completion_params: completionParams,
          },
        };

        const document = documents.get(id);

        const documentList = [];

        prompts.promptList.forEach((prompt) => {
          documentList.push(documents.get(prompt.promptId).content);
        });

        const data: any = {
          query: message,
          inputs: execute.inputs,
          documentId: id,
          collectionId: collectionId,
          documentFlow: document?.content,
          documents: documentList,
          model_config: configData,
          parent_message_id: last_answer?.id || null,
        };

        if ((config.file_upload as any)?.enabled && files?.length) data.files = files;

        execute.setStatus("pending");

        handleSend("api/docTest", data, {
          onGetConversationMessages: (conversationId, getAbortController) =>
            Promise.resolve({ appId, conversationId, getAbortController }),
          onGetSuggestedQuestions: (responseItemId, getAbortController) =>
            Promise.resolve({ appId, responseItemId, getAbortController }),
        });
      },
      [chatListRef, appId, checkCanSend, completionParams, config, handleSend, execute.inputs, modelConfig],
    );

    useEffect(() => {
      if (execute.status === "start") {
        doSend("");
      }
    }, [execute.status]);

    useEffect(() => {
      if (injectChatList?.length) {
        handleUpdateChatList(injectChatList);
      }
    }, [injectChatList]);

    const doRegenerate = useCallback(
      (chatItem: ChatItem) => {
        const index = chatList.findIndex((item) => item.id === chatItem.id);
        if (index === -1) return;

        const prevMessages = chatList.slice(0, index);
        const question = prevMessages.pop();
        const lastAnswer = getLastAnswer(prevMessages);

        if (!question) return;

        handleUpdateChatList(prevMessages);
        doSend(question.content, question.message_files, lastAnswer);
      },
      [chatList, handleUpdateChatList, doSend],
    );

    // const allToolIcons = useMemo(() => {
    //   const icons: Record<string, any> = {}
    //   modelConfig.agentConfig.tools?.forEach((item: any) => {
    //     icons[item.tool_name] = collectionList.find((collection: any) => collection.id === item.provider_id)?.icon
    //   })
    //   return icons
    // }, [collectionList, modelConfig.agentConfig.tools])

    useImperativeHandle(
      ref,
      () => {
        return {
          handleRestart,
        };
      },
      [handleRestart],
    );

    // const setShowAppConfigureFeaturesModal = useAppStore(s => s.setShowAppConfigureFeaturesModal)

    return (
      <Chat
        config={config}
        chatList={chatList}
        isResponding={isResponding}
        chatContainerClassName="px-3 pt-6"
        chatFooterClassName="px-3 pt-10 pb-0"
        showFeatureBar
        showFileUpload={false}
        // onFeatureBarClick={setShowAppConfigureFeaturesModal}
        suggestedQuestions={suggestedQuestions}
        onSend={doSend}
        inputs={execute.inputs}
        inputsForm={[]}
        onRegenerate={doRegenerate}
        onStopResponding={handleStop}
        showPromptLog
        // allToolIcons={allToolIcons}
        noSpacing
      />
    );
  },
);

DebugExecute.displayName = "DebugExecute";

export default observer(DebugExecute);
