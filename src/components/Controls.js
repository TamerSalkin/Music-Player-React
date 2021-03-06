import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faAngleLeft,
  faAngleRight,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

function Controls({
  songInfo,
  setSongInfo,
  audioRef,
  isPlaying,
  setIsPlaying,
  songs,
  setSongs,
  currentSong,
  setCurrentSong,
}) {
  // Event Handlers
  const playMusicHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const activeLibraryHandler = (songActive) => {
    const newSongs = songs.map((songm) => {
      if (songm.id === songActive.id) {
        return {
          ...songm,
          active: true,
        };
      } else {
        return {
          ...songm,
          active: false,
        };
      }
    });
    setSongs(newSongs);
  };

  const skipHandler = async (direction) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "back") {
      await setCurrentSong(
        songs[(songs.length + currentIndex - 1) % songs.length]
      );
      activeLibraryHandler(
        songs[(songs.length + currentIndex - 1) % songs.length]
      );
    } else if (direction === "forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }
    if (isPlaying) {
      audioRef.current.play();
    }
  };
  const getTime = (t) => {
    return Math.floor(t / 60) + ":" + ("0" + Math.floor(t % 60)).slice(-2);
  };
  const inputHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({
      ...songInfo,
      currentTime: e.target.value,
    });
  };

  //Input animation inline styling
  const inputAnimationStyle = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };
  const trackBackground = {
    background: `linear-gradient(to right, ${currentSong.color[0]},${currentSong.color[1]})`,
  };

  return (
    <div className="player">
      <div className="time-control">
        <p>{getTime(songInfo.currentTime)}</p>
        <div className="track" style={trackBackground}>
          <input
            type="range"
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            onChange={inputHandler}
          />
          <div className="animate-track" style={inputAnimationStyle}></div>
        </div>
        <p>{songInfo.duration ? getTime(songInfo.duration) : "0:00"}</p>
      </div>
      <div className="play-control">
        <FontAwesomeIcon
          onClick={() => {
            skipHandler("back");
          }}
          className="skip-back"
          size="2x"
          icon={faAngleLeft}
        />
        <FontAwesomeIcon
          className="play"
          onClick={playMusicHandler}
          size="2x"
          icon={isPlaying ? faPause : faPlay}
        />
        <FontAwesomeIcon
          onClick={() => {
            skipHandler("forward");
          }}
          className="skip-forward"
          size="2x"
          icon={faAngleRight}
        />
      </div>
    </div>
  );
}

export default Controls;
