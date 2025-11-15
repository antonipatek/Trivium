import { Icon } from "@iconify/react";
import { CategoryCard } from "../../components/CategoryCard";
import Trivium from "/trivium.svg";

export function Home() {
    return (
        <div className="w-full min-h-screen flex flex-col space-y-14">
            <div className="mt-12 flex flex-col items-center">
                <p className="flex flex-row items-center gap-2 text-2xl sm:text-3xl font-bold tracking-tight">
                    <img src={Trivium} className="h-10 w-10" />
                    <p className="bg-clip-text text-transparent bg-linear-to-b from-white to-white/75">
                        Trivium
                    </p>
                </p>
                <div className="mt-2 text-lg prose prose-gray dark:prose-invert">
                    test your knowledge
                </div>
            </div>

            <div className="grow flex justify-center items-start">
                <div className="w-1/2 space-y-4">
                    <CategoryCard title="global knowledge" questions={5} difficulty="easy" />
                    <CategoryCard title="mathematics" questions={10} difficulty="medium" />
                    <CategoryCard title="anime" questions={20} difficulty="hard" />
                    <CategoryCard title="art" questions={10} difficulty="hard" />
                    <CategoryCard title="history" questions={30} difficulty="medium" />
                </div>
            </div>
        </div>
    );
}
