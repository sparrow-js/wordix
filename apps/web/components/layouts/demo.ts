//             let markdown = "";
//             const editor = window.editor;
//             if (editor) {
//               // 获取文档节点大小
//               const docSize = editor.state.doc.content.size;
//               // 获取最后一个节点
//               const lastNode = editor.state.doc.lastChild;
//               // 计算最后一个节点的开始位置
//               const lastNodeStart = docSize - lastNode.nodeSize + 1; // +1 是因为节点开头从1开始而不是0
//               // 找到最后一个节点的结束位置
//               const lastNodeEnd = docSize;
//               const endPosition = editor.state.doc.content.size;
//               console.log("****************", lastNodeEnd, endPosition);
//               markdown += "**test**";
//               editor.commands.insertContentAt(lastNodeEnd, "**test**"); // setContent supports markdown format
//               setTimeout(() => {
//                 markdown += `创建一个有效的落地页设计方案。
// * 理解您的目标市场和产品特性，以便准确传达信息。
// * 确保页面设计简洁且视觉吸引力强。
// * 包括引人注目的标题和清晰的号召性用语（CTA）。
// * 提供相关且有价值的内容，支持用户决策。
// * 使用高质量的图像和视频，以增强用户体验。
// * 优化页面加载速度和移动设备的兼容性。
// * 添加用户点评或推荐以增加可信度。
// 步骤
// 1. 定义目标：`;
//                 const deleteToPosition = editor.state.doc.content.size;
//                 // 执行删除操作
//                 editor.chain().focus().deleteRange({ from: endPosition, to: deleteToPosition }).run();
//                 editor.commands.insertContentAt(lastNodeEnd, markdown);
//               }, 1100);
//               setTimeout(() => {
//                 markdown += `明确落地页的主要目标（如收集潜在客户信息、产品销售、用户注册等）。
// 2. 了解受众：研究目标受众，以定制内容和设计。
// 3. 设计构架：规划页面结构，包括头部、主体内容、CTA区域和底部。
// 4. 撰写文案：编写简洁有力的标题和支持性内容。
// 5. 选择视觉元素：选择和编辑图片或视频，以支持页面信息。
// 6. 技术实现：使用HTML/CSS等技术实现页面设计，确保跨设备兼容。
// 7. 测试与优化：在不同设备和浏览器上测试页面，并根据数据反馈进行优化。
// 输出格式
// 请提供一个详细的HTML/CSS文件结构或框架，包含说明每个部分的功能和内容。您还可以使用设计工具创建一个原型，并附上说明文档。`;
//                 const deleteToPosition = editor.state.doc.content.size;
//                 // 执行删除操作
//                 editor.chain().focus().deleteRange({ from: endPosition, to: deleteToPosition }).run();
//                 editor.commands.insertContentAt(lastNodeEnd, markdown);
//               }, 2000);
//             }
