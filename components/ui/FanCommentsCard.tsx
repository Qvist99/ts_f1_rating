import Slider from "./Slider"
import { DriverWithCommentsAndStats } from "@/lib/types"
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { shuffleArray } from "@/lib/utils";


export default function FanCommentsCard({ driver }: { driver: DriverWithCommentsAndStats }) {
    const commentsPerSlide = 3;

    const positiveComments = driver.driver_comments.filter(comment => comment.type === "positive");
    const negativeComments = driver.driver_comments.filter(comment => comment.type === "negative");

    // randomize the comments into a new array so we can show different comments each time
    const tagged = [
        ...positiveComments.map(comment => ({ comment, type: "positive" as const })),
        ...negativeComments.map(comment => ({ comment, type: "negative" as const })),
    ];

    const randomizedComments = shuffleArray(tagged);

    const slidePages = [];

    for (let i = 0; i < randomizedComments.length; i += commentsPerSlide) {
        slidePages.push(randomizedComments.slice(i, i + commentsPerSlide));
    }


    return (
        <div className="py-2 px-4 flex flex-col h-full gap-4">
            <div>
                <p className="text-text-muted font-bold text-lg">Fan Comments</p>
            </div>

            <div className="h-full">
                <Slider
                    pages={slidePages.map((comments, index) => (
                        <div key={index} className="flex flex-col gap-2 ">
                            {comments.map((c, idx) => (
                                <Comment key={idx} comment={c.comment.text} type={c.type} />
                            ))}
                        </div>
                    ))} action={{ label: "Have Your Say", href: `/dashboard/user-comments` }}
                />
            </div>
        </div>
    )
}



function Comment({ comment, type }: { comment: string; type: "positive" | "negative" }) {
    const bgHex = type === "positive" ? "#192825" : "#271F25";
    const leftBorderHex = type === "positive" ? "#3FB950" : "#F85149";
    const labelHex = type === "positive" ? "#38B950" : "#D62F25";

    return (
        <div className="border-l-4 h-20 px-2 py-1" style={{ borderColor: leftBorderHex, backgroundColor: bgHex }} >
            <div className="flex gap-2 items-center font-condensed font-bold" style={{ color: labelHex }}>
                {type === "positive" ?
                    <>
                        <ThumbsUp color={labelHex} size={16} />
                        <p>Positive</p>
                    </>
                    :
                    <>
                        <ThumbsDown color={labelHex} size={16} />
                        <p>Negative</p>
                    </>
                }
            </div>
            <p className="text-sm text-text-primary font-medium ml-2">"{comment}"</p>
        </div>
    )
}

