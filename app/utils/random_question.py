def parse_questions():
    import json
    f = open("cards.json", 'r')
    wp = open("questions.txt", 'w+')
    ques = json.load(f)["blackCards"]

    for q in ques:
        if q["pick"]==1:
            print(q["text"], file = wp)

def pick_random():
    with open('questions.txt') as f:
        l = f.readlines().split("\n")
