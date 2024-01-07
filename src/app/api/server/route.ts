const handler = async () => {
    return new Response(JSON.stringify({ code: 420, state: 200, message: "visit /login to login with Blizzard oauth" }));
}

export { handler as GET }