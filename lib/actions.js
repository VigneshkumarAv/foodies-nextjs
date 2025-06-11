"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";
function isInvalidText(text) {
  return !text || text.trim() === "";
}
export async function ShareMeal(prevState, formData) {
  //server action function

  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    image: formData.get("image"),
    creator: formData.get("name"),
    creator_email: formData.get("email"),
  };
  if (
    isInvalidText(meal.title) ||
    isInvalidText(meal.summary) ||
    isInvalidText(meal.instructions) ||
    isInvalidText(meal.creator) ||
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image || meal.image.size ===0
  ) {
    //throw new Error("Invalid Input");
    return {
      message: 'Invalid input.'
    }
  }
  await saveMeal(meal);
  //revalidatePath('/meals','page'); -> to revalidate only the meals page and not nested pages
  //revalidatePath('/','layout'); -> entire website
  //revalidatePath('/meals','layout'); // to revalidate meals and nested pages
  revalidatePath('/meals');
  redirect("/meals");
}
