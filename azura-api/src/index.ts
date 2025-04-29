import { startApolloServer } from "./app";
import connectDB from "./config/db";
import env from "./config/env";

const PORT = env.port || 3000;

const startServer = async () => {
  await connectDB();
  const httpServer = await startApolloServer();
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  });
};

startServer();
