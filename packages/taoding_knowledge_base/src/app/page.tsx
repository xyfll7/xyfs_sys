
import * as ww from "@wecom/jssdk";
export default function Home() {
  return (
    <div className="">
      <main className="">
        <button onClick={() => {
          console.log(ww.SDK_VERSION);
        }}>打开会话</button>

      </main>
      <footer className="">

      </footer>
    </div>
  );
}
