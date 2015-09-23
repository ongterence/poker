var translateSuit = function(card) { //takes card object.
    var suit = card.suit;
    switch (suit) {
        case 0:
            suit = 'spades'
            break;
        case 1:
            suit = 'hearts'
            break;
        case 2:
            suit = 'diamonds'
            break;
        case 3:
            suit = 'clubs'
            break;
    };
    return suit; // returns suit as string.
};


var translateRank = function(card) { //takes card OR number object.
    if (typeof card === 'object') {
        var rank = card.rank;
    } else {
        var rank = card;
    };
    var rank = rank + 2;
    switch (rank) {
        case 11:
            rank = 'Jack'
            break;
        case 12:
            rank = 'Queen'
            break;
        case 13:
            rank = 'King'
            break;
        case 14:
            rank = 'Ace'
            break;
        default:
            break;
    };
    return "" + rank; // returns rank as string. 
};


var translateCard = function(card) { // takes card as object
    var rank = translateRank(card); // rank = card.rank
    var suit = translateSuit(card); // suit = card.suit
    return "" + rank + " of " + suit;
};


var translateDeck = function(deck) { // takes deck as array of objects
    var parsed = [];
    for (var i = 0; i < deck.length; i++) {
        parsed[i] = translateCard(deck[i])
    };
    var translated = parsed.join(', ');
    return translated; // returns string. 
};

var sortHand = function(hand) { // takes array of 5 objects
    hand.sort(function(a, b) {
        if (a.rank < b.rank) {
            return 1;
        };
        if (a.rank > b.rank) {
            return -1;
        };
        // rank a must be equal to rank b, so sort by suit. 
        if (a.suit < b.suit) {
            return 1;
        };
        if (a.suit > b.suit) {
            return -1;
        };
        return 0; // this should only happen comparing a duplicate card - Ace of Spades vs. Ace of Spades
    });
    return hand; // returns sorted array of five objects ---- should I build this as a constructor? 
};



var isWheel = function(hand) { // is this is a five high straight with Ace for low?
    if (hand[0].rank === 12 && hand[1].rank === 3 && hand[2].rank === 2 &&
        hand[3].rank === 1 && hand[4].rank === 0) {
        return true;
    } else {
        return false;
    };
};


var isFlush = function(hand) { // is this a flush? 
    var flushhand = []
    for (var i = 0; i < hand.length; i++) {
        flushhand[i] = hand[i];
    }
    flushhand.sort(function(a, b) {
        if (a.suit < b.suit) {
            return 1;
        };
        if (a.suit > b.suit) {
            return -1;
        };
        // a must be equal to b
        return 0;
    });
    if (flushhand[0].suit === flushhand[4].suit) {
        return true;
    } else {
        return false;
    };
};


var isStraight = function(hand) { // is this a straight? 
    a = isWheel(hand);
    b = true;
    for (var i = 0; i < 4; i++) {
        if (hand[i].rank !== hand[i + 1].rank + 1) {
            b = false;
        }; //endif
    }; //endfor
    return (a || b);
};


var isStraightFlush = function(hand) { // is this a straight AND a flush? 
    if (isFlush(hand) && isStraight(hand)) {
        return true;
    } else {
        return false;
    };
};


var isQuads = function(hand) { // is this four of a kind?
    var a = hand[0].rank === hand[3].rank; // only true if XXXXY
    var b = hand[1].rank === hand[4].rank; // only true if XYYYY
    if (a || b) {
        return true;
    } else {
        return false;
    };
};


var isBoat = function(hand) { // is this a full house?
    var a = hand[0].rank === hand[2].rank && hand[3].rank === hand[4].rank; // true if XXXYY - since we sorted, we can skip the middle. If 0 = 2, 1 must = 0 & = 2
    var b = hand[0].rank === hand[1].rank && hand[2].rank === hand[4].rank; // true if XXYYY
    if (a || b) {
        return true;
    } else {
        return false;
    };
};


var isTrips = function(hand) { // is this three of a kind?
    var a = hand[0].rank === hand[2].rank && hand[3].rank !== hand[4].rank; // true if XXXYZ 
    var b = hand[2].rank === hand[4].rank && hand[1].rank !== hand[2].rank; // true if XYZZZ
    var c = hand[1].rank === hand[3].rank && hand[0].rank !== hand[4].rank; // only true if XYYYZ
    if ((a || b || c) && !isQuads(hand)) {
        return true;
    } else {
        return false;
    };
};


var isTwoPair = function(hand) { //is this two pair?
    var a = hand[0].rank === hand[1].rank && hand[2].rank == hand[3].rank; // true if XXYYZ 
    var b = hand[0].rank === hand[1].rank && hand[3].rank == hand[4].rank; // true if XXYZZ \
    var c = hand[1].rank === hand[2].rank && hand[3].rank == hand[4].rank; // true if XYYZZ 
    if ((a || b || c) && !isQuads(hand) && !isBoat(hand) && !isTrips(hand)) {
        return true;
    } else {
        return false;
    };
};


var isPair = function(hand) { //is this one pair? 
    var a = hand[0].rank === hand[1].rank || hand[1].rank === hand[2].rank ||
        hand[2].rank === hand[3].rank || hand[3].rank === hand[4].rank;
    var b = !isTwoPair(hand) && !isTrips(hand) && !isBoat(hand) && !isQuads(
        hand);
    if (a && b) {
        return true;
    } else {
        return false;
    };
};


 
var getRanking = function(hand) { //takes object
    hand = sortHand(hand);
    var ranking = {
        handtype: 1,
        rank1: -1,
        rank2: -1,
        rank3: -1,
        rank4: -1,
        rank5: -1,
        player: hand.player
    }; // default is high card. 
    var whatDoYouHave = [
        isStraightFlush(hand),
        isQuads(hand),
        isBoat(hand),
        isFlush(hand),
        isStraight(hand),
        isTrips(hand),
        isTwoPair(hand),
        isPair(hand)
    ];
    for (var i = 0; i < whatDoYouHave.length; i++) {
        if (whatDoYouHave[i] === true) {
            ranking.handtype = 9 - i;
            i = whatDoYouHave.length + 1; // kill the loop. 
        };
    };
    if (ranking.handtype === 9) { // straight flush
        ranking.rank1 = hand[0].rank;
        if (isWheel(hand)) {
            ranking.rank1 = 3
        };
    };
    if (ranking.handtype === 8) { // quads
        ranking.rank1 = hand[2].rank;
        if (hand[2].rank !== hand[0].rank) {
            ranking.rank2 = hand[0].rank;
        } else {
            ranking.rank2 = hand[4].rank;
        }
    };
    if (ranking.handtype === 7) { // boat
        ranking.rank1 = hand[2].rank;
        if (hand[2].rank !== hand[0].rank) {
            ranking.rank2 = hand[0].rank;
        } else {
            ranking.rank2 = hand[4].rank;
        }
    };
    if (ranking.handtype === 6) { // flush
        ranking.rank1 = hand[0].rank;
        ranking.rank2 = hand[1].rank;
        ranking.rank3 = hand[2].rank;
        ranking.rank4 = hand[3].rank;
        ranking.rank5 = hand[4].rank;
    };
    if (ranking.handtype === 5) { // straight
        if (isWheel(hand)) {
            ranking.rank1 = 3
        } else {
            ranking.rank1 = hand[0].rank;
        };
    };
    if (ranking.handtype === 4) { // trips
        ranking.rank1 = hand[2].rank;
        if (hand[0].rank !== hand[1].rank && hand[1].rank !== hand[2].rank) {
            ranking.rank2 = hand[0].rank;
            ranking.rank3 = hand[1].rank;
        };
        if (hand[0].rank === hand[1].rank && hand[1].rank === hand[2].rank) {
            ranking.rank2 = hand[3].rank;
            ranking.rank3 = hand[4].rank;
        };
        if (hand[0].rank !== hand[1].rank && hand[1].rank === hand[2].rank) {
            ranking.rank2 = hand[0].rank;
            ranking.rank3 = hand[4].rank;
        };
    };
    if (ranking.handtype === 3) { // two pair
        ranking.rank1 = hand[1].rank;
        ranking.rank2 = hand[3].rank;
        if (hand[0].rank === hand[1].rank && hand[2].rank === hand[3].rank) {
            ranking.rank3 = hand[4].rank;
        };
        if (hand[1].rank === hand[2].rank && hand[3].rank === hand[4].rank) {
            ranking.rank3 = hand[0].rank;
        };
        if (hand[0].rank === hand[1].rank && hand[3].rank === hand[4].rank) {
            ranking.rank3 = hand[2].rank;
        };
    };
    if (ranking.handtype === 2) { // one pair
        if (hand[0].rank === hand[1].rank) {
            ranking.rank1 = hand[0].rank;
            ranking.rank2 = hand[2].rank;
            ranking.rank3 = hand[3].rank;
            ranking.rank4 = hand[4].rank;
        };
        if (hand[1].rank === hand[2].rank) {
            ranking.rank1 = hand[1].rank;
            ranking.rank2 = hand[0].rank;
            ranking.rank3 = hand[3].rank;
            ranking.rank4 = hand[4].rank;
        };
        if (hand[2].rank === hand[3].rank) {
            ranking.rank1 = hand[2].rank;
            ranking.rank2 = hand[0].rank;
            ranking.rank3 = hand[1].rank;
            ranking.rank4 = hand[4].rank;
        };
        if (hand[3].rank === hand[4].rank) {
            ranking.rank1 = hand[3].rank;
            ranking.rank2 = hand[0].rank;
            ranking.rank3 = hand[1].rank;
            ranking.rank4 = hand[2].rank;
        };
    };
    if (ranking.handtype === 1) { // high card
        ranking.rank1 = hand[0].rank;
        ranking.rank2 = hand[1].rank;
        ranking.rank3 = hand[2].rank;
        ranking.rank4 = hand[3].rank;
        ranking.rank5 = hand[4].rank;
    };
    return ranking;
};


var parseRanking = function(ranking) { //takes object, returns string
    var lingo = "";
    switch (ranking.handtype) {
        case 9: //sf
            lingo = translateRank(ranking.rank1) + "-high Straight Flush."
            return lingo;
            break;
        case 8: //4k
            lingo = "Quad " + translateRank(ranking.rank1) + "s with a " +
                translateRank(ranking.rank2) + " kicker.";
            return lingo;
            break;
        case 7: //boat
            lingo = translateRank(ranking.rank1) + "s full of " +
                translateRank(ranking.rank2) + "s.";
            return lingo;
            break;
        case 6: //flush
            lingo = translateRank(ranking.rank1) + "-high Flush with " +
                translateRank(ranking.rank2) + ", " + translateRank(ranking
                    .rank3) + ", " + translateRank(ranking.rank4) + ", " +
                translateRank(ranking.rank5) + " kickers.";
            return lingo;
            break;
        case 5: //straight
            lingo = translateRank(ranking.rank1) + "-high Straight.";
            return lingo;
            break;
        case 4: //trips
            lingo = "Trip " + translateRank(ranking.rank1) + "s with " +
                translateRank(ranking.rank2) + ", " + translateRank(ranking
                    .rank3) + " kickers.";
            return lingo;
            break;
        case 3: //2p
            lingo = translateRank(ranking.rank1) + "s up with " +
                translateRank(ranking.rank2) + "s and a " + translateRank(
                    ranking.rank3) + " kicker.";
            return lingo;
            break;
        case 2: //1p
            lingo = "Pair of " + translateRank(ranking.rank1) + "s with " +
                translateRank(ranking.rank2) + ", " + translateRank(ranking
                    .rank3) + ", " + translateRank(ranking.rank4) +
                " kickers.";
            return lingo;
            break;
        case 1: //highcard
            lingo = translateRank(ranking.rank1) + " high with " +
                translateRank(ranking.rank2) + ", " + translateRank(ranking
                    .rank3) + ", " + translateRank(ranking.rank4) + ", " +
                translateRank(ranking.rank5) + " kickers.";
            return lingo;
            break;
        default:
            return "I dunno.";
            break;
    };
};


var grabManualInputHand = function(input) { //takes string of form AsKsQsTs9s from inputX() call
    var hand = [];
    for (var i = 0; i < input.length; i = i + 2) {
        inputRank = input.charAt(i);
        inputSuit = input.charAt(i + 1);
        switch (inputRank) {
            case 'A':
                inputRank = 12;
                break;
            case 'K':
                inputRank = 11;
                break;
            case 'Q':
                inputRank = 10;
                break;
            case 'J':
                inputRank = 9;
                break;
            case 'T':
                inputRank = 8;
                break;
            default:
                if (inputRank === NaN || inputRank < 2) {
                    console.log("not a valid card rank");
                    inputRank = -1;
                    break;
                };
                inputRank = inputRank - 2;
                break;
        }; // end switch(inputRank)
        switch (inputSuit) {
            case 's':
                inputSuit = 0;
                break;
            case 'h':
                inputSuit = 1;
                break;
            case 'd':
                inputSuit = 2;
                break;
            case 'c':
                inputSuit = 3;
                break;
            default:
                console.log("not a suit");
                inputSuit = -1;
                break;
        }; // end switch(inputsuit)
        hand[i / 2] = {
            rank: inputRank,
            suit: inputSuit
        }; //stick the card in the hand
        hand = sortHand(hand); // sort the hand once you've got it. 
    }; // end for loop - you should now have an array of 5 objects - a poker hand
    return hand;
};



var input1 = function(input) {
    var hand = grabManualInputHand(input);
    console.log(JSON.stringify(hand));
    var ranking = getRanking(hand);
    console.log(JSON.stringify(ranking));
    document.getElementById("manualRankingName1").innerHTML = parseRanking(
        ranking);
};


var compareHands = function(input1, input2) {
    var hand1 = grabManualInputHand(input1);
    var hand2 = grabManualInputHand(input2);
    hand1.player = 'Player 1';
    hand2.player = 'Player 2';
    console.log(JSON.stringify(hand1));
    console.log(JSON.stringify(hand2));
    var ranking1 = getRanking(hand1);
    var ranking2 = getRanking(hand2);
    console.log('ranking 1: ' + JSON.stringify(ranking1));
    console.log('ranking 2: ' + JSON.stringify(ranking2));
    document.getElementById("input1Rank").innerHTML = 'Hand 1: ' +
        parseRanking(ranking1);
    document.getElementById("input2Rank").innerHTML = 'Hand 2: ' +
        parseRanking(ranking2);
    var winner = determineWinner(hand1, hand2);
    console.log(winner);
    document.getElementById("winner").innerHTML = "" + winner;
};



var determineWinner = function(player1, player2) {
    hand1 = getRanking(player1);
    hand2 = getRanking(player2);
    handArray1 = [hand1.handtype, hand1.rank1, hand1.rank2, hand1.rank3,
        hand1.rank4, hand1.rank5
    ];
    handArray2 = [hand2.handtype, hand2.rank1, hand2.rank2, hand2.rank3,
        hand2.rank4, hand2.rank5
    ];
    if (JSON.stringify(handArray1) === JSON.stringify(handArray2)) {
        return 'The hands are tied with ' + parseRanking(ranking1);
    } else {
        winner = betterHand(player1, player2);
        return 'The winner is ' + winner.player + ' with ' + parseRanking(
            getRanking(winner));
    };
};


var betterHand = function(player1, player2) {
    hand1 = getRanking(player1);
    hand2 = getRanking(player2);
    player1.player = 'Player 1';
    player2.player = 'Player 2';
    handArray1 = [hand1.handtype, hand1.rank1, hand1.rank2, hand1.rank3,
        hand1.rank4, hand1.rank5
    ];
    handArray2 = [hand2.handtype, hand2.rank1, hand2.rank2, hand2.rank3,
        hand2.rank4, hand2.rank5
    ];
    for (var i = 0; i < 6; i++) {
        if (handArray1[i] > handArray2[i]) {
            i = 7;
            player1.isTied = false;
            return player1
        };
        if (handArray1[i] < handArray2[i]) {
            i = 7;
            player2.isTied = false;
            return player2
        };
    };
    player1.isTied = true;
    return player1;
};

