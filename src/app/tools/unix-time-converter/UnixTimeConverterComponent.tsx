"use client";

import Selector from "@/app/components/common/Selector";
import { useCallback, useEffect, useState } from "react";
import { User } from "@clerk/backend";
import { saveHistory } from "@/utils/clientUtils";
import { ToolType } from "@prisma/client";
import useDebounce from "@/app/hooks/useDebounce";

enum TimeOption {
  SecondsSinceEpoch = "Seconds Since Epoch",
  MillisecondsSinceEpoch = "Milliseconds Since Epoch",
  ISO8601 = "ISO 8601",
}

const timeOptions = [
  {
    label: "Milliseconds Since Epoch",
    value: TimeOption.MillisecondsSinceEpoch,
  },
  { label: "Seconds Since Epoch", value: TimeOption.SecondsSinceEpoch },
  { label: "ISO 8601", value: TimeOption.ISO8601 },
];

export default function UnixTimeConverterComponent({
  user,
  isProUser,
}: {
  user: User | null;
  isProUser: boolean;
}) {
  const [timeOption, setTimeOption] = useState<TimeOption>(
    timeOptions[0].value
  );
  const [timeString, setTimeString] = useState<string>("");
  const [localTime, setLocalTime] = useState<string>("");
  const [utcTime, setUtcTime] = useState<string>("");
  const [unixTime, setUnixTime] = useState(0);
  const [day, setDay] = useState<string>("");
  const [dayOfYear, setDayOfYear] = useState<number>(0);
  const [isLeapYear, setIsLeapYear] = useState<boolean>(false);
  const [otherDateFormats, setOtherDateFormats] = useState<string[]>([]);
  const [timeInMillisecondsState, setTimeInMillisecondsState] =
    useState<number>(0);
  const [relativeTime, setRelativeTime] = useState<string>("");

  const debouncedTimeString = useDebounce(timeString, 1000);

  useEffect(() => {
    if (debouncedTimeString) {
      void saveHistory({
        user,
        isProUser,
        toolType: ToolType.UnixTimeConverter,
        onError: () => {},
        metadata: {
          timeString,
        },
      });
    }
  }, [debouncedTimeString]);

  const generateLocalTime = (timeInMilliseconds: number) =>
    setLocalTime(new Date(timeInMilliseconds).toLocaleString());

  const generateUtcTime = (timeInMilliseconds: number) =>
    setUtcTime(new Date(timeInMilliseconds).toUTCString());

  const generateUnixTime = (timeInMilliseconds: number) =>
    setUnixTime(Math.floor(timeInMilliseconds / 1000));

  const generateDay = (timeInMilliseconds: number) =>
    setDay(
      new Date(timeInMilliseconds).toLocaleString("en-us", { weekday: "long" })
    );

  const generateIsLeapYear = (timeInMilliseconds: number) => {
    const currentDate = new Date(timeInMilliseconds);
    const year = currentDate.getFullYear();

    setIsLeapYear((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
  };

  const generateDayOfYear = (timeInMilliseconds: number) =>
    setDayOfYear(
      Math.floor(
        (timeInMilliseconds -
          new Date(new Date().getFullYear(), 0, 0).getTime()) /
          1000 /
          60 /
          60 /
          24
      )
    );

  const generateOtherDateFormats = (timeInMilliseconds: number) => {
    const currentDate = new Date(timeInMilliseconds);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const dayNumber = currentDate.getDate();

    const longDayOfWeek = currentDate.toLocaleString("en-us", {
      weekday: "long",
    });
    const shortDayOfWeek = currentDate.toLocaleString("en-us", {
      weekday: "short",
    });

    const longMonthInEnglish = currentDate.toLocaleString("en-us", {
      month: "long",
    });
    const shortMonthInEnglish = currentDate.toLocaleString("en-us", {
      month: "short",
    });

    setOtherDateFormats([
      `${year}-${month}-${dayNumber}`,
      `${month}-${dayNumber}-${year}`,
      `${year}/${month}/${dayNumber}`,
      `${month}/${dayNumber}/${year}`,
      `${shortDayOfWeek} ${longMonthInEnglish} ${dayNumber}, ${year}`,
      `${longDayOfWeek} ${longMonthInEnglish} ${dayNumber}, ${year}`,
      `${shortDayOfWeek} ${shortMonthInEnglish} ${dayNumber}, ${year}`,
      `${longDayOfWeek} ${shortMonthInEnglish} ${dayNumber}, ${year}`,
    ]);
  };

  const generateOutput = useCallback((timeInMilliseconds: number) => {
    generateLocalTime(timeInMilliseconds);
    generateUtcTime(timeInMilliseconds);
    generateUnixTime(timeInMilliseconds);
    generateDay(timeInMilliseconds);
    generateDayOfYear(timeInMilliseconds);
    generateIsLeapYear(timeInMilliseconds);
    generateOtherDateFormats(timeInMilliseconds);
  }, []);

  const generateRelativeTime = useCallback((timeInMilliseconds: number) => {
    const currentTime = Date.now();
    const timeDifference = currentTime - timeInMilliseconds;

    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
    const days = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24)
    );
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    let relativeTimeString = "";

    if (years > 0) {
      relativeTimeString += `${years} year${years === 1 ? "" : "s"} `;
    }
    if (days > 0) {
      relativeTimeString += `${days} day${days === 1 ? "" : "s"} `;
    }
    if (hours > 0) {
      relativeTimeString += `${hours} hour${hours === 1 ? "" : "s"} `;
    }
    if (minutes > 0) {
      relativeTimeString += `${minutes} minute${minutes === 1 ? "" : "s"} `;
    }
    if (seconds > 0) {
      relativeTimeString += `${seconds} second${seconds === 1 ? "" : "s"} `;
    }

    relativeTimeString += "ago";
    setRelativeTime(relativeTimeString);
  }, []);

  useEffect(() => {
    try {
      if (!timeString) return;
      if (timeOption === TimeOption.SecondsSinceEpoch) {
        const timeInMilliseconds = parseInt(timeString, 10) * 1000;
        if (Number.isNaN(timeInMilliseconds)) {
          throw new Error("Time string is not a number");
        }
        generateOutput(timeInMilliseconds);
        setTimeInMillisecondsState(timeInMilliseconds);
      }
      if (timeOption === TimeOption.ISO8601) {
        const timeInMilliseconds = Date.parse(timeString);
        if (Number.isNaN(timeInMilliseconds)) {
          throw new Error("Time string is not a number");
        }
        generateOutput(timeInMilliseconds);
        setTimeInMillisecondsState(timeInMilliseconds);
      } else if (timeOption === TimeOption.MillisecondsSinceEpoch) {
        const timeInMilliseconds = parseInt(timeString, 10);
        if (Number.isNaN(timeInMilliseconds)) {
          throw new Error("Time string is not a number");
        }
        generateOutput(timeInMilliseconds);
        setTimeInMillisecondsState(timeInMilliseconds);
      }
    } catch (e) {
      console.error("Couldn't parse time string");
    }
  }, [generateOutput, generateRelativeTime, timeOption, timeString]);

  useEffect(() => {
    if (!timeInMillisecondsState) {
      setRelativeTime("");
      return;
    }
    // Update the relative time immediately when the component mounts
    generateRelativeTime(timeInMillisecondsState);

    // Update the relative time every second
    const interval = setInterval(
      () => generateRelativeTime(timeInMillisecondsState),
      1000
    );

    // Clear the interval when the component unmounts to prevent memory leaks
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [generateRelativeTime, timeInMillisecondsState]);

  const clear = () => {
    setTimeString("");
    setLocalTime("");
    setUtcTime("");
    setUnixTime(0);
    setDay("");
    setDayOfYear(0);
    setIsLeapYear(false);
    setOtherDateFormats([]);
    setTimeInMillisecondsState(0);
  };

  const getCurrentTime = () => {
    if (timeOption === TimeOption.MillisecondsSinceEpoch) {
      setTimeString(new Date().getTime().toString());
    } else if (timeOption === TimeOption.SecondsSinceEpoch) {
      setTimeString(Math.floor(new Date().getTime() / 1000).toString());
    } else if (timeOption === TimeOption.ISO8601) {
      setTimeString(new Date().toISOString());
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 overflow-y-scroll">
      <div className="w-full">
        <div className="flex gap-4 items-center mb-4">
          <p className="font-bold text-xl "> Input: </p>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={getCurrentTime}
          >
            Now
          </button>
          <button
            type="button"
            className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={clear}
          >
            Clear
          </button>
          <Selector
            values={timeOptions}
            handleClick={(entry) => {
              clear();
              setTimeOption(entry.value);
            }}
          />
        </div>
        <div className="flex gap-4 w-full">
          <input
            className="px-4 py-2 block w-full rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={timeString}
            onChange={(e) => setTimeString(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className="w-full h-full">
        <div className="flex flex-col mb-4 gap-4">
          <p className="font-bold text-xl"> Output: </p>
          <div>
            <p className="font-bold text-sm mb-2">Local Time:</p>
            <div className="flex gap-2">
              <input
                readOnly
                className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={localTime}
              />
              <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(localTime);
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">UTC Time:</p>
            <div className="flex gap-2">
              <input
                readOnly
                className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={utcTime}
              />
              <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(utcTime);
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">Relative Time:</p>
            <div className="flex gap-2">
              <input
                readOnly
                className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={relativeTime}
              />
              <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(relativeTime);
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">UNIX Time:</p>
            <div className="flex gap-2">
              <input
                readOnly
                className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={unixTime}
              />
              <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(unixTime.toString());
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">Day of week:</p>
            <div className="flex gap-2">
              <input
                readOnly
                className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={day}
              />
              <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(day);
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">Day of year:</p>
            <div className="flex gap-2">
              <input
                readOnly
                className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={dayOfYear}
              />
              <button
                type="button"
                className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(dayOfYear.toString());
                }}
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="font-bold text-sm mb-2">Is leap year?</p>
            <div className="flex gap-2">
              <input
                readOnly
                className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={isLeapYear?.toString()}
              />
            </div>
          </div>

          {otherDateFormats.length > 0 && (
            <div>
              <p className="font-bold text-sm mb-2">
                Other date formats (local time):
              </p>
              <div className="flex flex-col gap-4">
                {otherDateFormats.map((date) => (
                  <div key={date} className="flex gap-2">
                    <input
                      readOnly
                      className="px-4 py-2 w-full block rounded-lg border-0
        bg-gray-700 text-white shadow-sm ring-1 ring-inset
        ring-gray-300 focus:ring-2 focus:ring-inset
        focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={date}
                    />
                    <button
                      type="button"
                      className="rounded-md bg-indigo-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      onClick={async () => {
                        await navigator.clipboard.writeText(date);
                      }}
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
