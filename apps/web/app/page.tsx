import Board from "./components/board";

const NavalBattleBoard = () => {
  return (
    <div style={{ height: "100vh", alignContent: "center" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyItems: "center",
          justifyContent: "center",
        }}
      >
        <Board />
      </div>
    </div>
  );
};

export default NavalBattleBoard;
