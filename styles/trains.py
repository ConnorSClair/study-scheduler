



from typing import * 
# len(arrivals) == len(departures)
# both lists ordered
def minimum_platforms(arrivals: List[str], departures: List[str]):

    for k in range(0,len(arrivals)):
        arrivals[k] = time_to_int(arrivals[k])
        departures[k] = time_to_int(departures[k])

    platforms_required: int = 0
    i = 0
    j = 0
    platforms = 0
    max_platforms = 0

    while i < len(arrivals):
        if arrivals[i] < departures[j]:
            platforms += 1
            i += 1
            max_platforms = max(max_platforms, platforms)
        else:
            platforms -= 1
            j += 1
        # platforms += 1
    return max_platforms

def time_to_int(time: str):
    dots_loc = time.find(":")
    return int(time[0:dots_loc] + time[dots_loc + 1:])


if __name__ == "__main__":
    #print(type(time_to_int("10:00")))
    #exit()

    arrivals = ["8:30","9:25","10:00","11:20","15:40","18:00"]
    departures = ["10:20","11:20","12:45","12:10","22:00","19:00"]
    
    # departures_adj = ["10:20","11:20","12:45","13:00","15:00","19:00"]
    print(minimum_platforms(arrivals,departures))
    print("expect: ")







