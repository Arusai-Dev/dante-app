const quizPrompt = (card: {front: string; back:string }) => `

You must respond only with a valid JSON object. Do not include any extra text, formatting, or markdown.
Here is a multiple-choice question:

<question> ${card.front} </question>

The correct answer is:
<answer> ${card.back} </answer>

Respond with exactly one JSON object in the following format:
{
"options": ["option1", "option2", "option3", "option4"],
"explanation": "A brief explanation of why the answer is correct, only if it's informative. If not, use a single blank space: ' '."
}

Instructions:

1. Include the correct answer and 3 plausible incorrect answers, shuffled randomly in the "options" array.

2. The "explanation" must be meaningful. Do not write things like "because it is correct" or "this is the correct answer".

3. If no meaningful explanation can be given, set "explanation": " ".

Your output must be a single valid JSON object. Nothing else.

`

export default quizPrompt