## RadioScribe: Converting Live Talk Radio Streams Into Searchable Text Data

Before being introduced to the tech startup world in San Francisco, in my first year of college I worked at a morning radio talk show that sustained heavy listenership throughout the greater Bay Area.  Through my experience there I developed a strong affinity for the medium, learning to deeply appeciate the raw intimacy the format provided in ways unlike other forms of traditional mass media could achieve. 

I also learned to question its practicality in the modern age based on some of its flaws, namely the fact that talk radio broadcasting is ephemeral in nature, severely limiting the value of the content as well as its ability to reach and access listeners on a larger scale. Although podcasting in some respects counteracts these contraints, it still doesn't appropriately solve the problems inherent to live talk radio.  First, major terrestrial talk radio stations either do not podcast their content at all, or only do so in limited quantity and regularlity as a promotional mechanism for their live broadcasts.  Second, podcasts by themselves are not effective at providing context about their content. Both podcasts and live radio broadcasts alike force the listener to blindly and passively listen to the content with very little context or control. In the age of DVR, YouTube, Pandora, and Twitter, I felt that the radio can and should be delivered to listeners in a better way by embracing modern machine learning technology - ultimately empowering audiences with more context and on-demand control, while retaining its value as a real-time source of information. Since that delivery system did not exist, I decided to build my own.

The overall vision of my project, RadioScribe, was to create a web app that would allow radio listeners to easily search through radio content by keyword, and be able to seemlessly navigate back in time to the most recent segment that discussed that topic. I used a multinomial naive-bayes classifier that I trained to recognize universal news radio segments that users would want to navigate to quickly, but could have trouble finding via a simple text search. For instance, all news radio stations have a segment discussing weather, or politics, or sports, yet the words "weather", "politics", or "sports" may not ever be mentioned in the actual report.  With a little manual labor, I went through several thousand transcripts I had already collected, and labeled each one according to its topic.  After testing, the classifier currently performs with about 94% accuracy. Ultimately, users on the front-end can turn on the app and search "Traffic", and be brought immediately to the most recent labeled traffic report.  If a user searches for something other than one of the classifier's labels, mongodb's text search capabilties kick in and find the closest possible match.

<b>Brief explanation on how RadioScribe's processing works:</b>

The bulk of the processing that powers RadioScribe's core functionality is handled in one python class. It follows 6 main steps from start to finish. 

1) Aggregates live news radio streams from across the country.

2) Records audio from each stream in 1 minute intervals.

3) 1 minute chunk is partitioned into 15 5-second pieces.

4) All partitions are transcribed simultaneously using python multithreading pools.

5) Transcribed text is sent to multinomial naive bayes classifier and labeled if the text is recognized as pertaining to Sports, Weather, Finance, Politics, Traffic, or Commerical.

6) Transcribed text is uploaded to db along with parent station name, assigned label and timestamp position in audio file.

The entire process takes about 65 seconds to run, start to end. Thanks to the paralell processing capabilities of the python multiprocessing library, every 5 second partition can be transcribed, classified and uploaded to the database simulataneously, adding only a few additional seconds to the entire process after the initial 60 second recording. Radioscribe uses the Google Voice API for handling the process of converting audio to text. Possibly due to internal throttling efforts at Google, the Voice API can only transcribe audio in real-time, meaning it would normally take a full 60 seconds to transcribe a minute long piece of audio. Here, Python's multiprocessing library is most crucial, as it allows us to successfully circumnavigate the latency that this time constraint would cause by transcribing all file partitions at the same time - as mentioned taking only 5 about seconds rather than 60. This process runs every minute for each supported station.

Below is a simple flow chart that illustrates the process.

![alt text](https://squip.github.io/assets/radioscribe_process.png "Illustration of RadioScribe's transcription and classification method using parallell processing") 

RadioScribe is able to use this processing method to scale efficiently and support many news stations from accross the country simulatenously.

![alt text](https://squip.github.io/assets/radioscribe_scaling.png "RadioScribe uses this processing method on many news streams nationwide simultaneously")  

[View Project](http://162.243.83.70:5000/) 


