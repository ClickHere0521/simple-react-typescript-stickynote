import React, { useState } from 'react';
import { Resizable } from "re-resizable";
import './App.css';

type Item = { text: string, color: number, x: number, y: number, star: boolean };
type Items = { [key: string]: Item };

const CORLORS = ["#F2C079", "#FF7854", "#BD88FF", "#DEFB86", "#50ECFF", "#FFF"];

const App: React.FC = () => {
  const [items, setItems] = useState<Items>({
    '0': { text: "The beginning of the screenless design: UI jobs to be taken over by Solution Architect", color: 5, x: 100, y: 150, star: true },
    '1': { text: "13 Things You Should Give Up If You Want To Be a Successful UX Designer", color: 1, x: 100, y: 450, star: true },
    '2': { text: "The Psychology Principles Every UI/UX Designer Needs to Know", color: 3, x: 400, y: 150, star: false },
    '3': { text: "10 UI & UX Lessons from Designing My Own Product", color: 2, x: 400, y: 450, star: false },
    '4': { text: "52 Research Terms you need to know as a UX Designer", color: 4, x: 700, y: 150, star: false },
    '5': { text: "Text fields & Forms design - UI component series", color: 0, x: 700, y: 450, star: false },
  });
  const [dragging, setDragging] = useState({ key: "", x: 0, y: 0 });
  const [input, setInput] = useState("");
  const [editMode, setEditMode] = useState({ key: "", w: 0, h: 0 });
  const [show, setShow] = useState('all');
  const [cardZIndex, setCardZIndex] = useState('0');

  const add = () => {
    const lastKey:string|undefined = Object.keys(items).pop();
    const newPostKey:number = lastKey? Number(lastKey) + 1 : 0;
    setItems({...items,
      [newPostKey]: {
        ...items[newPostKey],
        text: "text here",
        color: 5,
        x: window.scrollX + Math.floor(Math.random() * (200 - 80) + 80),
        y: window.scrollY + Math.floor(Math.random() * (200 - 80) + 80),
      },
    });
  };

  const remove = (key: string) => {
    const tempItems = { ...items };
    delete tempItems[key];
    setItems(tempItems);
  };

  const StickyNote = (key: string) => {
    return (
      <Resizable
        key={key}
        style={{
          left: items[key].x + "px",
          top: items[key].y + "px",
          background: CORLORS[items[key].color],
          zIndex: key === cardZIndex ? 10000 : 0
        }}
        className="Card"
        enable={{ top:false, right:true, bottom:true, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false }}
        defaultSize={{
          width: 280,
          height: 280,
        }}
      >
        <div
          draggable
          onDragStart={(e) =>
            setDragging({
              key,
              x: e.clientX - items[key].x,
              y: e.clientY - items[key].y,
            })
          }
          onFocus={() => {
            setCardZIndex(key);
          }}
          className="Draggable"
        >
          <div className="NoteBody">
            <button className="DeleteBtn" onClick={() => remove(key)}>
              ×
            </button>
            <img 
              src={items[key].star ? (process.env.PUBLIC_URL + '/star.png') : (process.env.PUBLIC_URL + '/unStar.png')} 
              className="Image"
              alt="" 
              onClick={() => setItems({ ...items, [key]: { ...items[key], star: !items[key].star }})}
            />
            <div className="ColorSelector">
              {CORLORS.map((c, i) => (
                <div
                  key={c}
                  className="ColorCircle"
                  onClick={() => {
                    setItems({ ...items, [key]: { ...items[key], color: i }});
                  }}
                  style={{ background: c }}
                />
              ))}
            </div>
            {editMode.key === key ? (
              <textarea
                className="EditableText"
                // style={{ width: editMode.w-8, height: editMode.h }}
                onChange={(e) => setInput(e.target.value)}
                defaultValue={items[key].text}
                autoFocus
                onFocus={(e) => e.target.select()}
                onBlur={() => {
                  setInput("");
                  setEditMode({ key: "", w: 0, h: 0 });
                  input && setItems({ ...items, [key]: { ...items[key], text: input }});
                }}
              />
            ) : (
              <textarea
                className="Text"
                onClick={(e) =>
                  setEditMode({
                    key,
                    w: e.currentTarget.clientWidth,
                    h: e.currentTarget.clientHeight,
                  })
                }
              >
                {items[key].text}
              </textarea>
            )}
          </div>
        </div>
      </Resizable>
    );
  };

  const renderButtons = () => {
    return (
      <div>
        <button className="AddCard" onClick={() => add()}>
          ＋ add card
        </button>
        <button className="starredNotes" style={{backgroundColor: show === 'all' ? "cyan" : "white"}} onClick={() => setShow('all')}>
          all notes
        </button>
        <button className="starredNotes" style={{backgroundColor: show === 'star' ? "cyan" : "white"}} onClick={() => setShow('star')}>
          starred notes
        </button>
        <button className="starredNotes" style={{backgroundColor: show === 'unstar' ? "cyan" : "white"}} onClick={() => setShow('unstar')}>
          unstarred notes
        </button>
      </div>
    );
  }

  return (
    <div
      className="Board"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        if (!dragging || !items) return;
        setItems({...items,
          [dragging.key]: {
            ...items[dragging.key],
            x: e.clientX - dragging.x,
            y: e.clientY - dragging.y,
          }
        });
      }}
    >
      {renderButtons()}
      <div>
        {Object.keys(items).map((key) => {
          switch (show) {
            case 'all': return StickyNote(key);
            case 'star': return items[key].star ? StickyNote(key) : null;
            case 'unstar': return items[key].star ? null : StickyNote(key);
            default: return StickyNote(key);
          }
        })}
      </div>
    </div>
  );
}

export default App;
