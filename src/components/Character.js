import React, { useState, useEffect } from 'react';
import Summary from './Summary';

const Character = props => {
  const [loadedCharacter, setLoadedCharacter] = useState({});
  const [isLoading, setLoading] = useState(false);
  console.log('Rendering...');
  const fetchData = () => {
    console.log(
      'Sending Http request for new character with id ' +
        props.selectedChar
    );
    setLoading(true);
    fetch('https://swapi.co/api/people/' + props.selectedChar)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not fetch person!');
        }
        return response.json();
      })
      .then(charData => {
        const loadedCharacter = {
          id: props.selectedChar,
          name: charData.name,
          height: charData.height,
          colors: {
            hair: charData.hair_color,
            skin: charData.skin_color
          },
          gender: charData.gender,
          movieCount: charData.films.length
        };
        setLoadedCharacter(loadedCharacter)
        setLoading(false)
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(()=> {
    fetchData();

    //in return there is a cleanup finction, that is executed right before useEffect runs next time
    //or when the component is removed
    //remove listeners here of things like that
    return () => {
      console.log('Cleaning up...');
    }
  }, [props.selectedChar])

  //instead of this I add props.selectedChar to dependencies
  // componentDidUpdate(prevProps) {
  //   console.log('Component did update');
  //   if (prevProps.selectedChar !== props.selectedChar) {
  //     fetchData();
  //   }
  // }

  
  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('shouldComponentUpdate');
  //   return (
  //     nextProps.selectedChar !== props.selectedChar ||
  //     nextState.loadedCharacter.id !== loadedCharacter.id ||
  //     nextState.isLoading !== isLoading
  //   );
  // }


  
    let content = <p>Loading Character...</p>;

    if (!isLoading && loadedCharacter.id) {
      content = (
        <Summary
          name={loadedCharacter.name}
          gender={loadedCharacter.gender}
          height={loadedCharacter.height}
          hairColor={loadedCharacter.colors.hair}
          skinColor={loadedCharacter.colors.skin}
          movieCount={loadedCharacter.movieCount}
        />
      );
    } else if (!isLoading && !loadedCharacter.id) {
      content = <p>Failed to fetch character.</p>;
    }
    return content;
  
}
//by default only when props change - then it will rerender because of React.memo
export default React.memo(Character);

//for more control React.memo accepts callback function as a second argument
//this function  has to return true if the props are equal and the component should NOT re-render
//and should return false if the component SHOULD re-render
//the opposite of shouldComponentUpdate
//more like "youSaidNotToUpdate,right?"

// export default React.memo(Character, () => {

// });