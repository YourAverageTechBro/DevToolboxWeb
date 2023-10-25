import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import Link from "next/link";

const buttonStyles = cva(
  "flex items-center justify-center px-4 py-2 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-offset-1 disabled:opacity-60 disabled:pointer-events-none hover:bg-opacity-80",
  {
    variants: {
      intent: {
        primary: "bg-indigo-500 text-white",
        secondary:
          "bg-white text-gray-900 hover:bg-gray-100 shadow-sm ring-1 ring-inset ring-gray-300",
        noBackground: "text-blue-950 font-medium",
        danger: "bg-red-500 text-white focus:ring-red-500",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);

export interface Props
  extends ButtonOrLinkProps,
    VariantProps<typeof buttonStyles> {}
export function Button({ intent, fullWidth, ...props }: Props) {
  return (
    <ButtonOrLink className={buttonStyles({ intent, fullWidth })} {...props} />
  );
}

type ButtonOrLinkProps = ComponentProps<"button"> & ComponentProps<"a">;

export interface Props extends ButtonOrLinkProps {}

/**
 * This is a base component that will render either a button or a link,
 * depending on the props that are passed to it. The link rendered will
 * also correctly get wrapped in a next/link component to ensure ideal
 * page-to-page transitions.
 */
export function ButtonOrLink({ href, ...props }: Props) {
  const isLink = typeof href !== "undefined";

  let content = <button {...props} />;

  if (isLink) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
