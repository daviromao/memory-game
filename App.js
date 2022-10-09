import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  const [counter, setCounter] = useState(-1);

  const [previousCard, setPreviousCard] = useState(null);

  const [message, setMessage] = useState("Clique para iniciar um novo jogo!");

  const [board, setBoard] = useState([
    { id: 1, status: 0, color: "#8E44AD" },
    { id: 2, status: 0, color: "#DC7633" },
    { id: 3, status: 0, color: "#3498DB" },
    { id: 4, status: 0, color: "#DC7633" },
    { id: 5, status: 0, color: "#3498DB" },
    { id: 6, status: 0, color: "#8E44AD" },
  ]);

  const openCard = (card, index) => {
    if(!gameStarted) {
      return
    }

    if(card.status === 1) {
      return
    }

    let newBoard = [...board];
    card.status = 1;
    newBoard[index] = card;
    setBoard(newBoard);

    if(previousCard && previousCard.color === card.color) {
      setPreviousCard(null);
    } else if (previousCard && previousCard.color !== card.color) {
      setPreviousCard(null);
      setGameStarted(false);
      setMessage("Você perdeu! Clique para iniciar um novo jogo!");
    } else {
      setPreviousCard(card);
    }
  };

  const startGame = () => {
    setGameStarted(true);

    let newBoard = [...board];
    newBoard.map((card) => {
      card.status = 1;
    });

    //shuffle the cards
    for(let i = newBoard.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = newBoard[i];
      newBoard[i] = newBoard[j];
      newBoard[j] = temp;
    }

    setBoard(newBoard);
    setCounter(5);
  }

  useEffect(() => {
    if(counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
      setMessage(`Jogo iniciando em ${counter} segundos`);
    } else if (counter === 0 && gameStarted) {
      let newBoard = [...board];
      newBoard.map((card) => {
        card.status = 0;
      });
      setBoard(newBoard);
      setMessage("Jogo iniciado");
      setCounter(-1);
    }
  }, [counter, message]);

  useEffect(() => {
    //verify if all cards status is 1
    let allCardsOpened = board.every((card) => card.status === 1);
    if(allCardsOpened && counter === -1) {
      setGameStarted(false);
      setMessage("Você ganhou!");
    }
  }, [board, gameStarted, message])
  
  return (
    <View style={styles.app}>
      <Text>
        {message}
      </Text>
      <View style={styles.container}>
        {board.map((card, index) => (
          <TouchableOpacity key={card.id} onPress={() => openCard(card, index)}>
            <View
              style={[
                styles.card,
                { backgroundColor: card.status === 0 ? "#ABB2B9" : card.color },
              ]}
            ></View>
          </TouchableOpacity>
        ))}
        </View>

      <TouchableOpacity 
        disabled={gameStarted}
        onPress={startGame}
        style={{opacity: gameStarted ? 0.5 : 1}}
      >
        <View style={styles.button}>
          <Text style={[styles.buttonText]}>Iniciar um novo jogo</Text>
        </View>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    height: 50,
    width: 40,
    borderRadius: 4,
    margin: 4,
  },
  button: {
    backgroundColor: "#3498DB",
    padding: 10,
    borderRadius: 4,
    margin: 4,
  },
  buttonText: {
    color: "#fff",
  },
});
