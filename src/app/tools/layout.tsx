import ToolList from "@/app/components/common/ToolList";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={"h-full w-full flex"}>
      <ToolList />
      <div className={"pt-14 md:pt-4 px-4 flex-1 overflow-x-hidden"}>
        <div style={{ height: "calc(100% - 2rem)" }}>{children}</div>
      </div>
    </div>
  );
}
