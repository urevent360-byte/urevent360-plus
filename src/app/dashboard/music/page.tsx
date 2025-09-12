'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageProvider';
import { PlusCircle, X, Music, Disc } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type Song = {
  title: string;
  artist: string;
};

const SpotifyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-6 w-6"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#1DB954" stroke="none"></path>
    <path d="M7.5 15.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="white" stroke="none"></path>
    <path d="M16.5 14.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="white" stroke="none"></path>
    <path d="M7 10.5h10" stroke="white" strokeWidth="1.5"></path>
  </svg>
);


export default function MusicPreferencesPage() {
  const { language } = useLanguage();
  const [mustPlay, setMustPlay] = useState<Song[]>([]);
  const [doNotPlay, setDoNotPlay] = useState<Song[]>([]);
  const [newMustPlay, setNewMustPlay] = useState({ title: '', artist: '' });
  const [newDoNotPlay, setNewDoNotPlay] = useState({ title: '', artist: '' });

  const addSong = (list: 'must' | 'doNot') => {
    if (list === 'must' && newMustPlay.title) {
      setMustPlay([...mustPlay, newMustPlay]);
      setNewMustPlay({ title: '', artist: '' });
    } else if (list === 'doNot' && newDoNotPlay.title) {
      setDoNotPlay([...doNotPlay, newDoNotPlay]);
      setNewDoNotPlay({ title: '', artist: '' });
    }
  };

  const removeSong = (list: 'must' | 'doNot', index: number) => {
    if (list === 'must') {
      setMustPlay(mustPlay.filter((_, i) => i !== index));
    } else {
      setDoNotPlay(doNotPlay.filter((_, i) => i !== index));
    }
  };

  const t = {
    title: { en: 'Music Preferences', es: 'Preferencias Musicales' },
    description: { en: 'Let us know what you want to hear (and what you don\'t).', es: 'Dinos qué quieres escuchar (y qué no).' },
    mustPlayTitle: { en: 'Must Play List', es: 'Lista de Reproducción Obligatoria' },
    mustPlayDesc: { en: 'These songs are essential for your event.', es: 'Estas canciones son esenciales para tu evento.' },
    doNotPlayTitle: { en: 'Do Not Play List', es: 'Lista de No Reproducir' },
    doNotPlayDesc: { en: 'Keep these songs off the playlist.', es: 'Mantén estas canciones fuera de la lista.' },
    addSong: { en: 'Add Song', es: 'Añadir Canción' },
    titlePlaceholder: { en: 'Song Title', es: 'Título de la Canción' },
    artistPlaceholder: { en: 'Artist', es: 'Artista' },
    spotifyTitle: { en: 'Connect with Spotify', es: 'Conectar con Spotify' },
    spotifyDesc: { en: 'Import your playlists directly from Spotify for ultimate convenience.', es: 'Importa tus listas de reproducción directamente desde Spotify para máxima comodidad.' },
    connectBtn: { en: 'Connect Spotify', es: 'Conectar Spotify' },
  };

  const SongList = ({ title, description, songs, onRemove }: { title: string, description: string, songs: Song[], onRemove: (index: number) => void }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {songs.map((song, index) => (
            <li key={index} className="flex items-center justify-between bg-secondary p-3 rounded-md">
              <div className="flex items-center">
                <Music className="mr-3 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{song.title}</p>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => onRemove(index)}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
          {songs.length === 0 && <p className="text-sm text-muted-foreground">{language === 'en' ? 'No songs added yet.' : 'Aún no se han añadido canciones.'}</p>}
        </ul>
      </CardContent>
    </Card>
  );

  const AddSongForm = ({ newSong, setNewSong, onAdd }: { newSong: Song, setNewSong: (song: Song) => void, onAdd: () => void }) => (
    <div className="flex gap-2 items-end">
      <div className="flex-grow space-y-2">
        <label className="text-sm font-medium">{t.titlePlaceholder[language]}</label>
        <Input
          placeholder="e.g., Don't Stop Me Now"
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
        />
      </div>
      <div className="flex-grow space-y-2">
        <label className="text-sm font-medium">{t.artistPlaceholder[language]}</label>
        <Input
          placeholder="e.g., Queen"
          value={newSong.artist}
          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
        />
      </div>
      <Button onClick={onAdd} className="h-10">
        <PlusCircle className="mr-2 h-4 w-4" />
        {t.addSong[language]}
      </Button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title[language]}</h1>
          <p className="text-muted-foreground">{t.description[language]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <SongList title={t.mustPlayTitle[language]} description={t.mustPlayDesc[language]} songs={mustPlay} onRemove={(index) => removeSong('must', index)} />
          <AddSongForm newSong={newMustPlay} setNewSong={setNewMustPlay} onAdd={() => addSong('must')} />
        </div>
        <div className="space-y-6">
          <SongList title={t.doNotPlayTitle[language]} description={t.doNotPlayDesc[language]} songs={doNotPlay} onRemove={(index) => removeSong('doNot', index)} />
          <AddSongForm newSong={newDoNotPlay} setNewSong={setNewDoNotPlay} onAdd={() => addSong('doNot')} />
        </div>
      </div>

      <Separator className="my-12" />

      <Card className="bg-gradient-to-r from-[#1DB954]/5 to-[#191414]/10 border-green-500/20">
        <CardHeader>
            <div className="flex items-center">
                 <Disc className="h-8 w-8 text-green-500 mr-4" />
                <div>
                    <CardTitle className="text-2xl">{t.spotifyTitle[language]}</CardTitle>
                    <CardDescription>{t.spotifyDesc[language]}</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <Button variant="default" className="bg-[#1DB954] hover:bg-[#1DB954]/90 text-white font-bold">
            <SpotifyIcon />
            {t.connectBtn[language]}
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
