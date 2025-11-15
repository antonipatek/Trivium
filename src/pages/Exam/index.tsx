import { Icon } from "@iconify/react";
import { useEffect, useState } from "preact/hooks";

interface Question {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export function Exam() {
    const slug = location.pathname.split("/").pop() || "";
    const [currentIndex, setCurrentIndex] = useState(0);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState<(string | null)[]>([]);
    const [score, setScore] = useState<number | null>(null);

    const categoryMap: Record<string, number> = {
        "global-knowledge": 9,
        books: 10,
        film: 11,
        music: 12,
        "musicals-theatres": 13,
        television: 14,
        videogames: 15,
        boardgames: 16,
        "science-nature": 17,
        computers: 18,
        mathematics: 19,
        mythology: 20,
        sports: 21,
        geography: 22,
        history: 23,
        politics: 24,
        art: 25,
        celebrities: 26,
        animals: 27,
        vehicles: 28,
        comics: 29,
        gadgets: 30,
        anime: 31,
        cartoons: 32,
    };

    const decodeHtml = (html: string) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    const params = new URLSearchParams(window.location.search);
    const difficulty = params.get("difficulty") || "medium";
    const amount = Number(params.get("questions") || 10);
    const categoryId = categoryMap[slug];

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;
                const res = await fetch(url);
                const data = await res.json();

                setQuestions(
                    data.results.map((q: Question) => ({
                        question: decodeHtml(q.question),
                        correct_answer: decodeHtml(q.correct_answer),
                        incorrect_answers: q.incorrect_answers.map(decodeHtml),
                    })),
                );
                setAnswers(new Array(data.results.length).fill(null));
            } catch (err) {
                console.error(err);
                setTimeout(fetchQuestions, 2000);
            } finally {
                setLoading(false);
            }
        };

        document.title =
            slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) + " - Trivium";

        fetchQuestions();
    }, [slug]);

    const handleSelect = (index: number, answer: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const calculateScore = () => {
        const correctCount = questions.reduce(
            (acc, q, i) => acc + (answers[i] === q.correct_answer ? 1 : 0),
            0,
        );
        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);

        const savedResults = localStorage.getItem(slug) || "[]";
        const results = JSON.parse(savedResults);
        const newResult = {
            title: slug.replace(/-/g, " "),
            score: finalScore,
            date: new Date().toLocaleDateString("pl-PL"),
        };
        localStorage.setItem(slug, JSON.stringify([newResult, ...results].slice(0, 10)));
    };

    if (loading) {
        return (
            <p className="text-center text-white flex justify-center absolute top-1/2 right-0 left-0">
                <Icon icon="mingcute:loading-fill" className="animate-spin w-8 h-8" />
            </p>
        );
    }

    if (score !== null) {
        return (
            <div className="w-full flex flex-col items-center mt-10 space-y-6">
                <h1 className="text-3xl font-bold text-white capitalize">
                    {slug.replace(/-/g, " ")}
                </h1>
                <p className="text-xl text-white">Your score: {score}%</p>
            </div>
        );
    }

    const q = questions[currentIndex];
    const allAnswers = [...q.incorrect_answers, q.correct_answer];

    return (
        <div>
            <div className="flex justify-center">
                <div className="mt-2 absolute w-1/2 py-2 flex justify-between items-center border bg-[#070708] border-[#28252d] hover:border-[#494352] transition-all duration-250 rounded-2xl px-4 shadow-xl">
                    <div className="flex items-center space-x-4">
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
                                {slug.replace(/-/g, " ")}
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
                                            : "text-[#b3a4c8] border-[#18151c] hover:border-[#342e3b] hover:bg-[#a295b6]/5"
                                    }`}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div
                        className={`flex ${
                            currentIndex === 0 ? "justify-end" : "justify-between"
                        } items-center mt-6`}
                    >
                        {currentIndex > 0 && (
                            <button
                                onClick={() => setCurrentIndex((c) => c - 1)}
                                className="px-6 py-3 rounded-lg flex items-center justify-center space-x-2 bg-[#1b191f] text-[#a08eb3] cursor-pointer opacity-100 hover:bg-[#242128] hover:scale-110 transition-all duration-400"
                            >
                                <Icon icon="mdi:arrow-left" className="w-6 h-6" />
                                <span className="font-semibold">Back</span>
                            </button>
                        )}

                        {currentIndex === questions.length - 1 ? (
                            <button
                                disabled={!answers[currentIndex]}
                                onClick={calculateScore}
                                className={`px-6 py-3 rounded-lg flex items-center justify-center space-x-2 bg-[#1b191f] text-[#a08eb3] transition-all duration-400 ${
                                    !answers[currentIndex]
                                        ? "opacity-30 cursor-not-allowed"
                                        : "cursor-pointer opacity-100 hover:bg-emerald-500 hover:text-emerald-950 hover:scale-110"
                                }`}
                            >
                                <span className="font-semibold">Submit</span>
                                <Icon icon="mdi:check" className="w-6 h-6" />
                            </button>
                        ) : (
                            <button
                                disabled={!answers[currentIndex]}
                                onClick={() => setCurrentIndex((c) => c + 1)}
                                className={`px-6 py-3 rounded-lg flex items-center justify-center space-x-2 bg-[#1b191f] text-[#a08eb3] transition-all duration-400 ${
                                    !answers[currentIndex]
                                        ? "opacity-30 cursor-not-allowed"
                                        : "cursor-pointer opacity-100 hover:bg-[#242128] hover:scale-110"
                                }`}
                            >
                                <span className="font-semibold">Next</span>
                                <Icon icon="mdi:arrow-right" className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
