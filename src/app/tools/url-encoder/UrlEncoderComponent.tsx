"use client";

import { useEffect, useState } from "react";
import TextArea from "@/app/components/common/TextArea";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";
import { User } from "@clerk/backend";
import { ToolType } from "@prisma/client";
import useDebounce from "@/app/hooks/useDebounce";
import { saveHistory } from "@/utils/clientUtils";

export default function UrlEncoderComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const debouncedInput = useDebounce(input, 1000);

  useEffect(() => {
    if (debouncedInput) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.UrlParser,
        onError: () => {},
        metadata: {
          input,
        },
      });
    }
  }, [debouncedInput]);

  const encodeUrl = (text: string) => {
    try {
      setOutput(encodeURIComponent(text));
    } catch (e) {
      setOutput("")
    }
  };

  return (
    <div className="w-full h-full flex gap-4">
      <TextArea
        initialInput="https://www.google.com/search?q=youraveragetechbro&oq=youraveragetechbro&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg9MgYIAhBFGDwyBggDEEUYPDIGCAQQRRg8MgYIBRBFGDwyBggGEEUYPNIBCDgwMzRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8"
        onInputChange={(text) => {
          setInput(text);
          encodeUrl(text);
        }}
      />

      <div className="w-full h-full flex flex-col gap-4">
      
          <ReadOnlyTextArea
            value={output}
            title="Query JSON"
          />
        
      </div>
    </div>
  );
}
