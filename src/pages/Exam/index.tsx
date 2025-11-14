import { Icon } from "@iconify/react";
import { useEffect, useState } from "preact/hooks";

interface Question {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export function Exam() {
    const slug = location.pathname.split("/").pop();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [difficulty, setDifficulty] = useState<string>();
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<(string | null)[]>([]);
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = {
                    response_code: 0,
                    results: [
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Entertainment: Video Games",
                            question:
                                "What is the lowest amount of max health you can have in Team Fortress 2?",
                            correct_answer: "70",
                            incorrect_answers: ["100", "50", "95"],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Entertainment: Video Games",
                            question:
                                "Final Fantasy VI was originally released outside Japan under what name?",
                            correct_answer: "Final Fantasy III",
                            incorrect_answers: [
                                "Final Fantasy VI",
                                "Final Fantasy V",
                                "Final Fantasy II",
                            ],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Geography",
                            question: "Montreal is in which Canadian province?",
                            correct_answer: "Quebec",
                            incorrect_answers: ["Ontario", "Nova Scotia", "Alberta"],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Entertainment: Japanese Anime & Manga",
                            question:
                                "In Dragon Ball Z, who was the first character to go Super Saiyan 2?",
                            correct_answer: "Gohan",
                            incorrect_answers: ["Goku", "Vegeta", "Trunks"],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "General Knowledge",
                            question: "Which country has the most Trappist breweries?",
                            correct_answer: "Belgium",
                            incorrect_answers: ["Netherlands", "France", "USA"],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Entertainment: Comics",
                            question:
                                "In Marvel comics, which of the following is not one of the infinity stones?",
                            correct_answer: "Energy",
                            incorrect_answers: ["Time", "Power", "Soul"],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Entertainment: Video Games",
                            question:
                                "In the Portal series, Aperture Science was founded under what name in the early 1940s?",
                            correct_answer: "Aperture Fixtures",
                            incorrect_answers: [
                                "Aperture Lavatories",
                                "Aperture Science Innovators",
                                "Wheatley Laboratories",
                            ],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Entertainment: Film",
                            question:
                                "In the movie “The Iron Giant,” this character is the protagonist.",
                            correct_answer: "Hogarth Hughes",
                            incorrect_answers: ["Kent Mansley", "Dean McCoppin", "Annie Hughes"],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Science & Nature",
                            question: "What is the colour of unoxidized blood?",
                            correct_answer: "Red",
                            incorrect_answers: ["Blue", "Purple", "Green"],
                        },
                        {
                            type: "multiple",
                            difficulty: "medium",
                            category: "Entertainment: Video Games",
                            question: 'What is the mod "Cry of Fear" based off of?',
                            correct_answer: "Half-Life",
                            incorrect_answers: [
                                "Counter Strike: Source",
                                "Half-Life 2",
                                "It's a stand alone game, not a mod",
                            ],
                        },
                    ],
                };

                setDifficulty(data.results[0].difficulty);
                setQuestions(data.results);
                setAnswers(new Array(data.results.length).fill(null));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [slug]);

    const handleSelect = (qIndex: number, answer: string) => {
        const newAnswers = [...answers];
        newAnswers[qIndex] = answer;
        setAnswers(newAnswers);
    };

    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.correct_answer) correctCount++;
        });
        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);

        const savedResults = localStorage.getItem(slug || "");
        const results = savedResults ? JSON.parse(savedResults) : [];
        const newResult = {
            title: (slug || "").replace(/-/g, " "),
            score: finalScore,
            date: new Date().toLocaleDateString("pl-PL"),
        };
        localStorage.setItem(slug || "", JSON.stringify([newResult, ...results].slice(0, 10)));
    };

    if (loading)
        return (
            <p className="text-center text-white flex justify-center absolute top-1/2 right-0 left-0">
                <Icon icon="mingcute:loading-fill" className="animate-spin w-8 h-8" />
            </p>
        );

    if (score !== null)
        return (
            <div className="w-full flex flex-col items-center mt-10 space-y-6">
                <h1 className="text-3xl font-bold text-white capitalize">
                    {(slug || "").replace(/-/g, " ")}
                </h1>
                <p className="text-xl text-white">Your score: {score}/100</p>
            </div>
        );

    if (!questions.length) return <p className="text-white text-center mt-10">Brak pytań.</p>;

    const q = questions[currentIndex];
    const allAnswers = [...q.incorrect_answers, q.correct_answer];

    return (
        <div>
            <div className="flex justify-center">
                <div className="mt-2 absolute w-1/2 py-2 flex justify-between items-center border bg-[#070708] border-[#28252d] hover:border-[#494352] transition-all duration-250 rounded-2xl px-4 shadow-xl">
                    <div className="flex flex-row items-center space-x-4">
                        <div
                            onClick={() => (window.location.href = "/")}
                            className="group cursor-pointer w-8 h-8 flex justify-center items-center bg-[#141414] hover:bg-[#a396b6] transition-all duration-300 rounded-lg"
                        >
                            <Icon
                                icon="mdi:arrow-left"
                                className="transition-all duration-250 w-5 h-5 group-hover:text-black group-hover:scale-120"
                            />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-white capitalize">
                                {(slug || "").replace(/-/g, " ")}
                            </p>
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
                                • {questions.length} questions
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center h-screen justify-center space-y-6">
                <div className="w-full max-w-xl">
                    <div className="p-6 bg-black/40 rounded-xl border border-[#28252d] transition-opacity duration-300 ease-in-out animate-fade">
                        <p className="text-white font-semibold mb-3">
                            {currentIndex + 1}. {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {allAnswers.map((answer) => (
                                <button
                                    key={answer}
                                    onClick={() => handleSelect(currentIndex, answer)}
                                    className={`text-left font-medium -tracking-[.5px] py-3 px-2 rounded-lg transition-all duration-250 border cursor-pointer ${
                                        answers[currentIndex] === answer
                                            ? "bg-[#a295b6] text-[#18151c] border-transparent"
                                            : " text-[#b3a4c8] border-[#18151c] hover:border-[#342e3b] hover:bg-[#a295b6]/5"
                                    }`}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        className={`flex ${
                            currentIndex == 0 ? "justify-end" : "justify-between"
                        } items-center mt-6`}
                    >
                        {currentIndex == 0 ? null : (
                            <button
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex((c) => Math.max(0, c - 1))}
                                className={`px-6 py-3 rounded-lg transition-all items-center justify-center space-x-2 flex duration-400 bg-[#1b191f] text-[#a08eb3] ${
                                    currentIndex === 0
                                        ? "opacity-30 cursor-not-allowed"
                                        : "cursor-pointer opacity-100 hover:bg-[#242128] hover:scale-110"
                                }`}
                            >
                                <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                                <span className="font-semibold">Back</span>{" "}
                            </button>
                        )}

                        {currentIndex === questions.length - 1 ? (
                            <button
                                disabled={!answers[currentIndex]}
                                onClick={calculateScore}
                                className={`px-6 py-3 rounded-lg transition-all items-center justify-center space-x-2 flex duration-400 bg-[#1b191f] text-[#a08eb3] ${
                                    !answers[currentIndex]
                                        ? "opacity-30 cursor-not-allowed"
                                        : "cursor-pointer opacity-100 hover:bg-emerald-500 hover:text-emerald-950 hover:scale-110"
                                }`}
                            >
                                <span className="font-semibold">Submit</span>{" "}
                                <Icon icon="mdi:check" className="w-6 h-6" />
                            </button>
                        ) : (
                            <button
                                disabled={!answers[currentIndex]}
                                onClick={() =>
                                    setCurrentIndex((c) => Math.min(questions.length - 1, c + 1))
                                }
                                className={`px-6 py-3 rounded-lg transition-all items-center justify-center space-x-2 flex duration-400 bg-[#1b191f] text-[#a08eb3] ${
                                    !answers[currentIndex]
                                        ? "opacity-30 cursor-not-allowed"
                                        : "cursor-pointer opacity-100 hover:bg-[#242128] hover:scale-110"
                                }`}
                            >
                                <span className="font-semibold">Next</span>{" "}
                                <Icon icon="mdi:arrow-right" className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
