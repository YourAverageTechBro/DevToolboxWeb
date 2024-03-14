"use client";

import { useEffect, useState } from "react";
import { InvalidTokenError, jwtDecode } from "jwt-decode";
import FormattedJsonOutput from "@/app/components/common/FormatedJsonOutput";
import TextArea from "@/app/components/common/TextArea";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";

export default function JwtViewerComponent() {
  const [input, setInput] = useState("");
  const [headers, setHeaders] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string>()

  useEffect(() => {
    try {
      setHeaders(JSON.stringify(jwtDecode(input, { header: true })));
      setPayload(JSON.stringify(jwtDecode(input)));
      setError(undefined)
    } catch (e) {
      setHeaders("")
      setPayload("")
      setError((e as InvalidTokenError).message);
    }
  }, [input, setHeaders, setPayload, setError])

  return (
    <div className="w-full h-full flex flex-col gap-8">
      <div className="h-60">
        <TextArea
          initialInput={initialInput}
          onInputChange={(input) => setInput(input)}
        />
      </div>
      <div style={{ height: "calc(100% - 17rem)" }}>
        {error && (
          <div className="h-full">
            <ReadOnlyTextArea title="Error" value={error} />
          </div>
        )}
        {!error && (
          <div className="h-full flex gap-4">
            <FormattedJsonOutput title="Header" value={headers} />
            <FormattedJsonOutput title="Payload" value={payload} />
          </div>
        )}
      </div>
    </div>
  );
}


const initialInput = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'