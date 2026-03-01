import { auth } from "@/lib/auth";

const ServerPage = async () => {
  const session = await auth();
  console.log("=== auth() in ServerPage ===");
  console.log(session);
  const user = session ? session.user : null;

  return (
    <main className="flex justify-center items-center h-[70vh]">
      <div>
        {user && (
          <div className="max-w-4xl break-words">
            <h2 className="text-2xl font-bold text-white">Server Session</h2>
            <p>Id: {user.id}</p>
            <p>Alias: {user.alias}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ServerPage;
