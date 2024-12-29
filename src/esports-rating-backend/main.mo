import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

actor EsportsRating {
    // Data Structures
    private stable var games : [(Text, [Text])] = []; // List of (gameName, [players])
    private stable var ratings : [(Text, Nat)] = []; // List of (playerName, totalRating)

    // Add a Game
    public func addGame(gameName : Text, playerNames : [Text]) : async Text {
        games := Array.append(games, [(gameName, playerNames)]); // Use Array.append instead of #
        Debug.print("Game added: " # gameName);
        return "Game added successfully!";
    };

    // Submit a Rating
    public func ratePlayer(playerName : Text, rating : Nat) : async Text {
        var updated : Bool = false;
        
        // Create a temporary mutable array
        var updatedRatings : [(Text, Nat)] = [];
        
        for ((player, score) in ratings.vals()) {
            if (player == playerName) {
                updatedRatings := Array.append(updatedRatings, [(playerName, score + rating)]);
                updated := true;
            } else {
                updatedRatings := Array.append(updatedRatings, [(player, score)]);
            }
        };

        // If player not found, add a new entry
        if (not updated) {
            updatedRatings := Array.append(updatedRatings, [(playerName, rating)]);
        };
        
        ratings := updatedRatings;
        return "Rating submitted!";
    };

    // Retrieve Ratings
    public query func getRatings() : async [(Text, Nat)] {
        return ratings;
    };

    // Retrieve Games and Players
    public query func getGames() : async [(Text, [Text])] {
        return games;
    };
};