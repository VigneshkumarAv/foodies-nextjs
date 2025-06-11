import Image from 'next/image';
import classes from './page.module.css';
import { getMeal } from '@/lib/meals';
import { notFound } from 'next/navigation';

//dynamic metadata for dynamic pages
export async function generateMetadata({params}){
    const meal = getMeal(params.mealSlug);
    if(!meal){
        notFound();
    }
    return {
        title: meal.title,
        description: meal.summary
    };
}

//dynamic route
export default function MealDetailsPage({params}){
    const meal = getMeal(params.mealSlug); // params: {mealSlug: /juicy-cheese-burger} - as we are taking from db no async is needed here
    
    if(!meal){
        notFound();
    }
    
    meal.instructions = meal.instructions.replace(/\n/g, '<br/>');

    return <>
    <header className={classes.header}>
        <div className={classes.image}>
            <Image alt={meal.title} src={meal.image}  fill/>
        </div>
        <div className={classes.headerText}>
            <h1>{meal.title}</h1>
            <p className={classes.creator}>
                by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
            </p>
            <p className={classes.summary}>{meal.summary}</p>
        </div>
    </header>
    <main>
        <p className={classes.instructions} dangerouslySetInnerHTML={{
            __html: meal.instructions,
        }}>
        </p>
    </main>
    </>
}
