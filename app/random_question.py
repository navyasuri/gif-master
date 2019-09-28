import random, rake_nltk
def parse_questions():
    import json
    f = open("cards.json", 'r')
    wp = open("questions.txt", 'w+')
    ques = json.load(f)["blackCards"]

    for q in ques:
        if q["pick"]==1:
            print(q["text"], file = wp)

def pick_random():
    l = list()
    with open('questions.txt') as f:
        l = f.readlines()
        return l[random.randint(0,len(l)-1)].strip()

def get_keywords(sentence):
    r = rake_nltk.Rake()
    r.extract_keywords_from_text(sentence)
    allkeys = list(zip(*r.get_ranked_phrases_with_scores()))
    return allkeys[1][:2]


# rq = pick_random()
# print(rq)

# print(get_keywords(rq))
