import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const TRACK_QUERY_TEMPLATE = 'https://itunes.apple.com/lookup?id={collectionId}&limit=50&entity=song'

export default function TrackList({setAlertMessage}) { 
  const [trackData, setTrackData] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false); 
  const [previewAudio, setPreviewAudio] = useState(null); 

  const urlParams = useParams(); 
  useEffect(() => {
    setIsQuerying(true);
    const url = TRACK_QUERY_TEMPLATE.replace('{collectionId}', urlParams.collectionId);
    fetch(url)
      .then((response) => response.json())
      .then((data) => data.results.slice(1))
      .then((data) => {
        if(data.length === 0) {
          setAlertMessage('No tracks found for album.')
        }
        setTrackData(data);
        setIsQuerying(false);
      })
      .catch((error) => setAlertMessage(error.message));
  }, [urlParams.collectionId, setAlertMessage]);

  //for fun: allow for clicking to play preview audio!
  const togglePlayingPreview = (previewUrl) => {
    if(!previewAudio) { 
      const newPreview = new Audio(previewUrl);
      newPreview.addEventListener('ended', () => setPreviewAudio(null)) 
      setPreviewAudio(newPreview); 
      newPreview.play(); 
    } else {
      previewAudio.pause();
      setPreviewAudio(null); 
    }
  }

 
  trackData.sort((trackA, trackB) => trackA.trackNumber - trackB.trackNumber)


  const trackElemArray = trackData.map((track) => {
    let classList = "track-record";
    if(previewAudio && previewAudio.src === track.previewUrl){
      classList += " fa-spin";
    }

    return (
      <div key={track.trackId}>
        <div role="button" className={classList} onClick={() => togglePlayingPreview(track.previewUrl)}>
          <p className="track-name">{track.trackName}</p>
          <p className="track-artist">({track.artistName})</p>
        </div>
        <p className="text-center">Track {track.trackNumber}</p>
      </div>      
    )
  })

  return (
    <div>
      {isQuerying && <FontAwesomeIcon icon={faSpinner} spin size="4x" aria-label="Loading..." aria-hidden="false"/>}
      <div className="d-flex flex-wrap">
        {trackElemArray}
      </div>
    </div>
  )
}
