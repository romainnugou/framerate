import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import DirectorGameContent from "./contents/DirectorGameContent";
import CastGameContent from "./contents/CastGameContent";
import BestRatedGameContent from "./contents/BestRatedGameContent";
import LinkGameContent from "./contents/LinkGameContent";

const Game = () => {
  const location = useLocation();
  const [type, setType] = useState("");
  const [gameParams, setGameParams] = useState([]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const params = {};
    queryParams.forEach((value, key) => {
      params[key] = value;
    });
    setGameParams(params);
    setType(queryParams.get("type"));
  }, [location.search]);

  let gameContent = (<></>);
  if(type === 'director') {
    gameContent = (<DirectorGameContent params={gameParams} />);
  } else if(type === 'cast') {
    gameContent = (<CastGameContent params={gameParams} />);
  } else if(type === 'bestRated') {
    gameContent = (<BestRatedGameContent params={gameParams} />);
  } else if(type === 'link') {
    gameContent = (<LinkGameContent params={gameParams} />);
  }

  return (
    <Container>
      {gameContent}
    </Container>
  );
};

export default Game;
