import json
import os
from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
NOTES_FILE = "notes.json"

# go get my saved notes whenever I call load_notes()
def load_notes():

    # check whether the file exists
    if not os.path.exists(NOTES_FILE):
        return []

    # open the file
    with open(NOTES_FILE, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def save_notes(notes):
    with open(NOTES_FILE, "w") as f:
        json.dump(notes, f, indent = 4)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/notes", methods=["GET"])
def get_notes():
    return jsonify(load_notes())


@app.route("/api/notes", methods=["POST"])
def add_note():
    data= request.json
    notes = load_notes()
    new_note = {
        "id": len(notes) + 1,
        "title": data.get("title", "Untitled Note"),
        "content": data.get("content", ""),
        "date": data.get("date", "Today"),
    }
    notes.append(new_note)
    save_notes(notes)
    return jsonify(new_note), 201

@app.route("/api/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
  notes = load_notes()
  notes = [n for n in notes if n["id"] != note_id]
  save_notes(notes)
  return jsonify({"status": "success"})
    
if __name__ == "__main__":
    app.run(debug=True, port=5000)