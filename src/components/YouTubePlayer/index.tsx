import React, { useEffect } from 'react';
import { useAuth } from '../../AuthContext';

interface YouTubePlayerProps {
  playerRef: React.RefObject<HTMLDivElement>;
  setVideoPausado: React.Dispatch<React.SetStateAction<boolean>>;
  setMomentoVideo: React.Dispatch<React.SetStateAction<number>>;
  momentoVideo: number;
  perguntaAtual: number;
  videoConteudo: string; 
  conjuntoMinutagemPergunta: Array<number>; 

}

declare global {
  interface Window {
    YT: any;
  }
}


function getVideoIdFromUrl(url: string): string | null {
  const regex = /[?&]v=([^?&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}


const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoConteudo, conjuntoMinutagemPergunta,  playerRef, setVideoPausado, setMomentoVideo, momentoVideo, perguntaAtual }) => {
  const { user, token } = useAuth();

  useEffect(() => {
    if (!playerRef.current) return;

    const videoId = getVideoIdFromUrl(videoConteudo);

    if (!videoId) {
      console.error('URL do YouTube inválido');
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (!firstScriptTag.parentNode) return; 

    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let player: any;

    function onYouTubeIframeAPIReady() {
      player = new window.YT.Player(playerRef.current!, {
        height: '390',
        width: '640',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls:  user?.tipo_usuario === 'admin' ? 1 : 0,
          modestbranding: 1,
          playsinline: 1,
          fs: 0,
          rel: 0,
          loop: 1,
          start: 0, 
          autohide: 1,
          showinfo: 0,
          iv_load_policy: user?.tipo_usuario === 'admin' ? 1 : 0, 
        },
        events: {
          onReady: onPlayerReady,
        },
      });
    }
      function onPlayerReady(event: any) {
      event.target.playVideo();
      event.target.seekTo(momentoVideo || 0); 
      checkVideoTime();
    }

    function checkVideoTime() {
      setInterval(() => {
        if (player && player.getCurrentTime) {
          const currentTime = Math.floor(player.getCurrentTime()); 
          
          if (conjuntoMinutagemPergunta.length > 0) {
            conjuntoMinutagemPergunta.forEach((minutagem, index) => {
              if (currentTime === minutagem && perguntaAtual === index) {
                player.pauseVideo();
                setVideoPausado(true);
                setMomentoVideo(currentTime);
              }
            });
          }
        }
      }, 1000);
    }
    

    if (window.YT && window.YT.Player) {
      onYouTubeIframeAPIReady();
    } else {
      (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [playerRef, setVideoPausado, setMomentoVideo, momentoVideo, perguntaAtual, videoConteudo]);

  const videoStyle: React.CSSProperties = {};
  if (user?.tipo_usuario !== 'admin') {
    videoStyle.pointerEvents = 'none';
  }
  

  return <div ref={playerRef} style={videoStyle}></div>;
};

export default YouTubePlayer;
