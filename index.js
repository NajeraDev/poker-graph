const { ApolloServer, gql } = require('apollo-server')

class Deck {
    cards = [];
    
    constructor() {
    const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
    const symbols = ['♣', '♦', '♥', '♠'];
      symbols.forEach(symbol => {
          numbers.forEach(number => {  
          this.cards.push({number, symbol});
        });
      });
    }
    dispatchCards(size) {
        return new Array(size)
        .fill()
        .map(
          () =>
            this.cards.splice(parseInt(Math.random() * this.cards.length), 1)[0]
        );
    }
}

const typeDefs = gql`
type Card {
    number: String
    symbol: String
}

type Query {
    table: [Card]
    getCards(cards: Int): [Card]
}

type Mutation {
    restoreCards: String,
}
`;

let deck = new Deck()
let table = deck.dispatchCards(5)

const resolvers = {
    Query: {
        table: () => table,
        getCards: (_, { cards }) =>{
            return deck.dispatchCards(cards)
        },

    },
    Mutation: {
        restoreCards: () =>{
            deck = new Deck();
            table = deck.dispatchCards(5);
            return 'OK!'
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})
server.listen().then(({ url })=>{
    console.log(`Server ready at ${url}`)
})