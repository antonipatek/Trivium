import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

interface Props {
    title: string;
    questions: number;
    difficulty: string;
}

interface TestResult {
    title: string;
    score: number;
    date: string;
}

const titleToSlug = (title: string) => title.toLowerCase().replace(/\s+/g, "-");

export function CategoryCard({ title, questions, difficulty }: Props) {
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);

    const slug = titleToSlug(title);

    const Icons = {
        "global knowledge": "mdi:globe",
        mathematics: "mdi:calculator",
        anime: "streamline-flex:japanese-alphabet-solid",
        history: "mdi:books",
        art: "mdi:art",
    };

    useEffect(() => {
        const savedResults = localStorage.getItem(slug);
        if (savedResults) {
            setResults(JSON.parse(savedResults));
        }
    }, [slug]);

    return (
        <div>
            <div
                onClick={() => {
                    if (results.length == 0) return;
                    setOpen(!open);
                }}
                className={`${
                    results.length == 0 ? "" : "cursor-pointer"
                } rounded-lg border bg-[#070708] border-[#28252d] hover:border-[#494352] transition-all duration-250 flex flex-col`}
            >
                <div className="p-6 flex flex-row justify-between">
                    <div className="flex items-center flex-row space-x-4">
                        <div className="w-10 h-10 flex justify-center items-center bg-[#141317] rounded-xl">
                            <Icon icon={Icons[title]} className="text-[#b3a4c8] w-5 h-5" />{" "}
                        </div>
                        <div>
                            <p className="text-lg font-medium text-white capitalize">{title}</p>
                            <p className="text-[#b3a4c8]">
                                <span
                                    className={`${
                                        difficulty === "easy"
                                            ? "text-green-300"
                                            : difficulty === "medium"
                                            ? "text-orange-300"
                                            : "text-red-400"
                                    } capitalize`}
                                >
                                    {difficulty}
                                </span>{" "}
                                • {questions} questions
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <p
                            onClick={(e) => {
                                e.stopPropagation();
                                const slug = title.toLowerCase().replace(/\s+/g, "-");
                                window.location.href = `/exam/${slug}?difficulty=${difficulty}&questions=${questions}`;
                            }}
                            className="transition-all duration-350 cursor-pointer text-2xl font-semibold flex items-center tracking-wider text-[#b3a4c8] hover:text-[#e4d2fc]"
                        >
                            START
                        </p>
                        {results.length > 0 && (
                            <Icon
                                icon="mdi:chevron-down"
                                className={`text-[#b3a4c8] w-6 h-6 transition duration-300 ${
                                    open && "rotate-180"
                                }`}
                            />
                        )}
                    </div>
                </div>
                <div
                    className={`transition-all duration-400 overflow-hidden ${
                        open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                    } border-t border-[#28252d]`}
                >
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-[#28252d] p-4 hover:border-[#494352] transition-all"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-[#28252d] flex items-center justify-center">
                                                <span className="text-[#b3a4c8] font-medium">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <span className="text-white font-medium capitalize">
                                                {title}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-[#b3a4c8]">Date</span>
                                            <span className="text-white">{result.date}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#b3a4c8]">Score</span>
                                            <span className="text-white">
                                                <span
                                                    className={`font-bold tracking-wider ${
                                                        result.score > 70
                                                            ? "text-green-300"
                                                            : result.score > 40
                                                            ? "text-orange-300"
                                                            : "text-red-400"
                                                    }`}
                                                >
                                                    {result.score}%
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
