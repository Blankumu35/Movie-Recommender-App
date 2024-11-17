export function createUserVector(likedItems, itemData) {
  if (!likedItems || likedItems.length === 0) return null;

  // Initialize a zero vector with the same length as the feature vector of an item
  const numFeatures = Object.values(itemData)[0].length;
  let userVector = Array(numFeatures).fill(0);

  likedItems.forEach(item => {
    const itemVector = itemData[item.itemId];
    if (itemVector) {
      userVector = userVector.map((val, index) => val + itemVector[index]);
    }
  });

  // Average the vector by dividing by the number of liked items
  userVector = userVector.map(val => val / likedItems.length);

  return userVector;
}