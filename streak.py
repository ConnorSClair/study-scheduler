from typing import List
class Streak_Logic:
    def __init__(self):
        self.streak = 0
        self.days_until_next_study = 0

def streak(dates: List[int],today: int) -> Streak_Logic:
    result = Streak_Logic()
    if len(dates) == 0:
        return result
    elif len(dates) == 1:
        if dates[0] == today:
            result.streak += 1
            result.days_until_next_study = 1
        if dates[0] == today - 1:
            # studied yesterday
            result.streak = 1
            result.days_until_next_study = 0 #study today!
        return result
    else:
        # at least 2 dates in dates
        streak = 0
        prev = dates[0]
        for i in range(1,len(dates)):
            this = dates[i]
            diff = this - prev
            if diff == streak + 1:
                streak += 1
            elif diff > streak + 1:
                streak = 0
            else: 
                continue
            prev = this
        last_day = dates[len(dates) - 1]
        streak += 1
        diff = today - last_day
        if diff > streak:
            result.streak = 0
        else:
            result.streak = streak
        
        expected_next_session = last_day + streak
        days_until_next_study = expected_next_session - today
        if days_until_next_study < 0:
            result.days_until_next_study = 0
        else:
            result.days_until_next_study = days_until_next_study
    return result



if __name__ == "__main__":
    test_arrays = []
    test_todays = []
    expected_streak = []
    expected_duts = []
    #1 no dates
    test_arrays.append([])
    test_todays.append(2)
    expected_streak.append(0)
    expected_duts.append(0)
    # single date
    #2 2 days ago
    test_arrays.append([0])
    test_todays.append(2)
    expected_streak.append(0)
    expected_duts.append(0)
    #3 1 days ago
    test_arrays.append([1])
    test_todays.append(2)
    expected_streak.append(1)
    expected_duts.append(0)
    #4 today
    test_arrays.append([2])
    test_todays.append(2)
    expected_streak.append(1)
    expected_duts.append(1)
    # Multi dates
    #5 in a row & today
    test_arrays.append([2,3])
    test_todays.append(3)
    expected_streak.append(2)
    expected_duts.append(2)
    #6 in a row & not today and not required
    test_arrays.append([2,3])
    test_todays.append(4)
    expected_streak.append(2)
    expected_duts.append(1)
    #7 in a row & not today and required
    test_arrays.append([2,3])
    test_todays.append(5)
    expected_streak.append(2)
    expected_duts.append(0)
    #8 in a row & today and not required
    test_arrays.append([2,3])
    test_todays.append(4)
    expected_streak.append(2)
    expected_duts.append(1)
    #9 in a row & today and required
    test_arrays.append([2,3,5])
    test_todays.append(5)
    expected_streak.append(3)
    expected_duts.append(3)
    #10 complicated, today 
    test_arrays.append([1,10,15,16,18])
    test_todays.append(18)
    expected_streak.append(3)
    expected_duts.append(3)
    #11 complicated, yesterday
    test_arrays.append([1,10,15,16,18])
    test_todays.append(19)
    expected_streak.append(3)
    expected_duts.append(2)
    #12 complicated, missed :(
    test_arrays.append([1,10,15,16,18])
    test_todays.append(22)
    expected_streak.append(0)
    expected_duts.append(0)
    #13 way too much study
    test_arrays.append([1,2,3,4,5,6,7])
    test_todays.append(22)
    expected_streak.append(4)
    expected_duts.append(4)

    for i in range(len(test_arrays)):
        i = 10
        output = streak(test_arrays[i],test_todays[i])
        first = output.streak
        second = output.days_until_next_study
        if first != expected_streak[i]:
            print(f"Test {i+1} Expected streak: {expected_streak[i]} Found: {first}")
        if second != expected_duts[i]:
            print(f"Test {i+1} Expected duts: {expected_duts[i]} Found: {second}")