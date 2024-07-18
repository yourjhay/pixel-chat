const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export default function useHelper() {
    const renderText = (txt: string) => {
        if (!txt) return;
        return txt.split(" ").map((part, i) =>
            URL_REGEX.test(part) ? (
                <a
                    key={i}
                    target="_blank"
                    className="text-pink-800 font-bold"
                    href={part}
                >
                    {part}{" "}
                </a>
            ) : (
                part + " "
            )
        );
    };
    return { renderText };
}
