# Fourier Epicycles 

![shinchan demo](Shinchan_fourier.gif)

I have been pretty obsessed with Fourier transformations lately and have always enjoyed playing around with those cool websites where you can literally draw anything with epicycles. The only thing,I felt was missing was that I had to either draw things manually or use an SVG file format, neither of which was giving me good enough results.

So, I tried creating my own epicycles directly from an image (why not, I am cool, right?). Even though this is quite different from what I initially imagined ,which was to draw human sketches(soon realised why it was a bad idea 🙂) ,it actually works on cartoons to some extent. I did the mistake of trying it on myself, and it made me look like some bald old creature ,which I am definitely not! But this is still an ongoing project, and I haven’t given up yet.

![astha demo](astha.gif)
---

The main problem with my algorithm is that I am using an edge detector to detect boundaries, which needs to be adjusted for different images since some are much noisier than others. So, I need to improve the preprocessing pipeline. The second problem is that I’m using splines for fitting the points(samped form the edge). In principle, this connects all the points, but it doesn’t align well with the actual curves of the images, resulting in very rough and edgy images. I need to replace this with something that better respects the curvature of the images(I tried using Bézier curves, it didn’t work either).

I have been doing some research and found algorithms that can draw complete images with just one continuous line (which could solve my problem of point-fitting). I will try those algorithms next. Till then byee!!!
---

## Commands to run locally on your computer 

*Clone the repository to your machine.*

```bash
git clone https://github.com/Asthag29/Fourier_Transformation.git
cd Fourier_Transformation
```

*Create a virtual environment.*

```bash
python3 -m venv .venv
```

*Install project dependencies.*

```bash
pip install .
```

*Start the FastAPI backend server.*

```bash
uvicorn app:app --port 8000
```

*Start a HTTP server for the frontend.*

```bash
python3 -m http.server 8080
```

Don't use safari ,you can't increase the number of circles more than 100(probably browser issue), use arc or chrome.