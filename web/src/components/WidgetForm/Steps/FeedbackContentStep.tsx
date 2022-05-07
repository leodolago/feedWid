import { ArrowLeft, Camera } from "phosphor-react";
import { FormEvent, useState } from "react";
import { FeedbackType, feedbackTypes } from "..";
import { CloseButton } from "../../CloseButton";
import { ScreenshotButton } from "../ScreenshotButton";
import { api } from '../../../lib/api';
import { Loading } from "../../Loading";

interface FeedbackContentStepProps {
    feedbackType: FeedbackType;
    onFeedbackRestartRequested: () => void;
    onFeedbackSent: () => void;
}

export function FeedbackContentStep({
    feedbackType, 
    onFeedbackRestartRequested,
    onFeedbackSent,
} : FeedbackContentStepProps) {
    const [screenshot, setScreenshot] = useState<string | null>(null)
    const [comment, setComment] = useState('');
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);
    
    const FeedbackTYpeInfo = feedbackTypes[feedbackType];

    async function handleSubmitFeedback(event: FormEvent) {
        event.preventDefault();
        setIsSendingFeedback(true);

        try {
            console.log({
                type: feedbackType,
                comment,
                screenshot,
            })
            await api.post('feedbacks', {
                type: feedbackType,
                comment,
                screenshot,
            });

        }  catch(error) {
            console.log(error);
            setIsSendingFeedback(false);

        }

        setIsSendingFeedback(false);
        onFeedbackSent();
    }

    return(
        <>
            <header>
                    <button type="button" className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
                    onClick={onFeedbackRestartRequested}>
                        <ArrowLeft weight="bold" className="w-4 h-4" />
                    </button>
                    <span className="text-xl leading-6 flex items-center gap-2">
                        <img src={FeedbackTYpeInfo.image.source} alt={FeedbackTYpeInfo.image.alt} className="w-6 h-6" />
                        {FeedbackTYpeInfo.title}
                    </span>
                    <CloseButton />
                </header>
                <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
                    <textarea 
                    className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 focus:putline-none focus:resize-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin" 
                    placeholder="Conte com detalhes o que está acontecendo..."
                    onChange={event => setComment(event.target.value)}
                    />
                    <footer className="flex gap-2 mt-2">
                        <ScreenshotButton 
                        screenshot={screenshot}
                        onScreenshotTook={setScreenshot}
                        />
                        <button 
                        type="submit"
                        disabled={comment.length == 0 || isSendingFeedback}
                        className="p-2 bg-brand-500 rounded-md border-trasparent flex-1 justfy-center items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offeset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
                        >
                            {isSendingFeedback ? <Loading /> : 'Enviar feedback' }
                        </button>
                    </footer>
                </form>        
        </>
    );
}