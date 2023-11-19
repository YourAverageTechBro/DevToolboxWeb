"use client";

import React, {useEffect, useRef, useState} from "react";
import Selector from "@/app/components/common/Selector";
import ReadOnlyTextArea from "@/app/components/common/ReadOnlyTextArea";
import {User} from "@clerk/backend";
import useDebounce from "@/app/hooks/useDebounce";
import {saveHistory} from "@/utils/clientUtils";
import {ToolType} from "@prisma/client";
import {Button} from "@/app/components/common/Button";

enum Option {
    encode = "encode",
    decode = "decode",
}

const options = [
    {
        label: "Encode",
        value: Option.encode,
    },
    {
        label: "Decode",
        value: Option.decode,
    },
];

export default function Base64ImageEncoderComponent({
    user,
    isProUser,
}: {
    user: User | null;
    isProUser: boolean;
}) {
    const [input, setInput] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [output, setOutput] = useState("");
    const [currentOption, setCurrentOption] = useState<Option>(options[0].value);
    const debouncedOutput = useDebounce<string>(output, 1000);

    useEffect(() => {
        if (debouncedOutput) {
            void saveHistory({
                user,
                isProUser,
                toolType: ToolType.Base64ImageEncoder,
                onError: () => {
                },
                metadata: {
                    image,
                },
            });
        }
    }, [debouncedOutput]);
    // Encode a string to Base64
    const encodeBase64 = (file: File | null, callback: (base64: string) => void) => {
        if (file == null) return;
        const reader = new FileReader();

        reader.onload = () => {
            const base64String = reader.result as string;
            callback(base64String);
        };

        reader.readAsDataURL(file);
    }

    useEffect(() => {
        try {
            if (currentOption === Option.encode) {
                encodeBase64(image, base64 => {
                    setOutput(base64);
                });
            }
        } catch (e) {
            setOutput(
                `Invalid input — could not ${
                    currentOption === Option.decode ? "decode" : "encode"
                } string`
            );
        }
    }, [currentOption, input, image, isProUser, user]);

    function handleImageInput(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0])
            setImage(event.target.files[0]);
    }

    // Example usage
    return (
        <div className="w-full h-full flex gap-4">
            <div className="w-full h-full">
                <div className="flex items-center mb-4 gap-4">
                    <p className="font-bold text-xl"> Input: </p>
                    <button
                        type="button"
                        className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        onClick={() => {
                            if (currentOption == Option.encode) {
                                setImage(null);
                                setOutput("");
                            } else {
                                setInput("");
                            }
                        }}
                    >
                        Clear
                    </button>
                    <Selector
                        values={options}
                        handleClick={(entry) => {
                            setCurrentOption(entry.value);
                        }}
                    />
                </div>
                {currentOption == Option.encode ? <div
                        className="px-8 py-2 w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6 flex-col flex items-center justify-center"
                        style={{height: "calc(100% - 44px)"}}
                    >
                        <ImagePicker image={image} handleImageInput={handleImageInput}/>
                    </div>
                    :
                    <textarea
                        className="px-8 py-2 block w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        style={{height: "calc(100% - 44px)"}}
                        value={input}
                        onInput={(e) => setInput(e.currentTarget.value)}
                    />
                }
            </div>
            {currentOption == Option.encode ?
                <ReadOnlyTextArea value={output}/>
                :
                <div className="w-full h-full">
                    <div className="flex items-center mb-4 gap-4 justify-between">
                        <p className="font-bold text-xl px-3.5 py-1 ">Output</p>
                        {input && isValidToDownload(input) && <button
                            type="button"
                            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            onClick={async () => {
                                if (input && isValidToDownload(input)) {
                                    const link = document.createElement('a');
                                    link.href = input;
                                    link.download = 'download.' + (input.includes("/png;") ? "png" : "jpg");
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }
                            }}
                        >
                            Download
                        </button>}
                    </div>
                    <div
                        className="block px-8 py-2 w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6 flex-col"
                        style={{height: "calc(100% - 44px)"}}
                    >
                        <FitImage src={input} base64Enabled={true} alt="Unable to decode image"/>
                    </div>
                </div>
            }
        </div>
    );
}

function ImagePicker({image, handleImageInput}: {
    image: File | null,
    handleImageInput: (event: React.ChangeEvent<HTMLInputElement>) => void,
}) {
    let imageInputRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

    return <>
        {image && <FitImage src={URL.createObjectURL(image)} base64Enabled={false} alt="Input Image"/>}
        <input type="file" name="Select Image" onChange={handleImageInput}
               ref={imageInputRef}
               hidden/>
        <Button onClick={() => {
            imageInputRef.current?.click();
        }}>Choose Image</Button>
    </>;
}

function FitImage({src, base64Enabled, alt}: { src: string, base64Enabled: Boolean, alt: string }) {
    if (base64Enabled) {
        try {
            if (src.trim() == "") return <></>;
            atob(isValidBase64Format(src) ? src.split(",")[1] : src);
            if (!isValidBase64Format(src)) return <p style={{maxWidth: "30vw", wordWrap: 'break-word'}}>Unable to decode<br/>Input
                must begin with
                data:image/[a-zA-Z+]*;base64,<br/><br/>
                For example
                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcfRYWgAAAAAElFTkSuQmCC
            </p>

            return <img src={src}
                        style={{width: '100%', maxHeight: '85%', objectFit: 'contain', margin: '10px'}}
                        alt={alt}/>
        } catch (e: any) {
            let msg = e.message.split(": ");
            return <p>{msg.length > 1 ? msg[1] : msg[0]}</p>
        }
    }

    return <img src={src}
                style={{width: '100%', maxHeight: '85%', objectFit: 'contain', margin: '10px'}}
                alt={alt}/>
}

const isValidBase64Format = (base64String: string): boolean => {
    const regex = /^data:image\/[a-zA-Z+]*;base64,/;
    return regex.test(base64String);
};

function isValidToDownload(input: string) {
    try {
        if (input.trim() == "") return false;
        atob(isValidBase64Format(input) ? input.split(",")[1] : input);
        return isValidBase64Format(input);

    } catch (e) {
        return false;
    }
}
