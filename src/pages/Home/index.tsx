import { Icon } from "@iconify/react";
import { CategoryCard } from "../../components/CategoryCard";

export function Home() {
    return (
        <div className="w-full flex mt-12 items-center justify-center flex-col space-y-8">
            <div className="flex items-center flex-col">
                <p className="flex flex-row items-center gap-2 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight dark:text-gray-200">
                    <Icon icon="material-icon-theme:test-js" className="h-8 w-8" /> Trivium
                </p>
                <div className="mt-2 text-lg prose prose-gray dark:prose-invert">
                    test your knowledge
                </div>
            </div>
            <div className="w-1/2 space-y-4">
                <p className="inline-block text-xl sm:text-2xl font-bold text-gray-900 tracking-tight dark:text-gray-200">
                    Choose your level
                </p>
                <CategoryCard title="Global Knowledge" questions={5} difficulty="easy" />
                <CategoryCard title="Mathematics" questions={10} difficulty="medium" />
                <CategoryCard title="Anime" questions={20} difficulty="hard" />
            </div>
        </div>
    );
}
