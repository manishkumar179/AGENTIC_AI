import rl from 'readline/promises'

const readline = rl.createInterface({
    input:process.stdin,
    output:process.stdout
})

const prompt = await readline.question("Enter your prompt:- ");

console.log(`You entered:- ${prompt} `)

readline.close()
