import { useCallback, useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);
 
  const [prompt, setPrompt] = useState("");
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);

  console.log(prompt, chats);

  const callbackChat = useCallback(() => {
    const handleClick = async () => {
      setLoading(true);
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: chats,
          temperature: 0.7,
          max_tokens: 512,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: ["END OF POLICY"],
        });
     
        setChats([
          ...chats,
          {
            role: "assistant",
            content: response?.data?.choices[0]?.message?.content,
          },
        ]);
        setPrompt(response?.data?.choices[0]?.message?.content);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    handleClick();
  }, [chats, openai]);

  const handleChatUser = () => {
    setChats([
      ...chats,
      {
        content: `"${prompt}" ${' '} ${command}`,
        role: "user",
      },
    ]);
  };

  useEffect(() => {
    if (
      chats.length > 0 &&
      !loading &&
      chats[chats.length - 1]?.role === "user"
    ) {
      callbackChat();
    }
  }, [chats, callbackChat, loading]);

  const string = JSON.stringify(chats);
  const parse = JSON.parse(string);
  const reverse = parse.reverse();

  return (
    <>
      <div className="w-full  justify-center p-8">
        <textarea
          className="textarea rounded-sm w-full bg-gray-200"
          placeholder="Give kudos to your partners, you can generate by command input bellow"
          value={prompt}
          style={{ height: 280}}
          onChange={(e) => setPrompt(e.target.value)}  
        />
        <input
          type="text"
          placeholder="Type command ai here"
          className="input input-bordered text-sm rounded-sm w-full max-w-md h-8 bg-gray-200"
          onChange={(e) => setCommand(e.target.value)}
          disabled={loading}
        />
        <button
          className="btn btn-info mt-14 btn-sm ml-2"
          onClick={() => handleChatUser()}
          disabled={loading}
        >
          Generate
        </button>
      </div>
    </>
  );
}

export default App;
