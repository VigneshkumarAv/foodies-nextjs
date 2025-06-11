import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const db = sql('meals.db');

export async function getMeals(){
    await new Promise((resolve=> setTimeout(resolve, 2000)));
    //throw new Error("Loading meals failed");
    
    return db.prepare('SELECT * FROM meals').all(); //to get all meals
}
export function getMeal(slug){
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug); // to get single element
}
export async function saveMeal(meal){
    meal.slug = slugify(meal.title,{lower:true}); // to get slug using title
    meal.instructions = xss(meal.instructions); //sanitize and clean instructions

    const extension = meal.image.name.split('.').pop(); //jpeg or png
    const fileName = `${meal.slug}_${Math.floor(Math.random()*1000)}.${extension}`;
    //writing off image to public/images
    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();
    stream.write(Buffer.from(bufferedImage),(error)=>{
        if(error){
            throw new Error("Saving image failed");
            
        }
    });
    meal.image = `/images/${fileName}`; //storing only path to image to store it in db

    db.prepare(`
        INSERT INTO meals
            (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
         )
        `).run(meal);

}