var diameter = 600;
var color = d3.scaleOrdinal([`#dceefa`, `#a8d6f3`, `#97cef1`, `#74beec`, `#52ade7`, `#2f9de2`, `#1a7ebd`, `#135b89`]);
//alert("Open this visualization in Firefox only.")
d3.selectAll(".spinner").attr("visibility", "hidden");
var bubble = d3.pack(dataset).size([diameter, diameter]).padding(1.5);
var svg = d3
    .select("svg")
    .attr("width", diameter + 100)
    .attr("height", diameter + 100);
var nodes = d3.hierarchy(dataset).sum(function (d) {
    return d.Count;
});

var node = svg
    .selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function (d) {
        return !d.children;
    })
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    });

node.append("title").text(function (d) {
    return d.Name;
});

node.append("circle")
    .attr("r", function (d) {
        return d.r;
    })
    .style("fill", function (d, i) {
        return color(i);
    });

node.append("text")
    .attr("dy", ".2em")
    .attr("class", "txt")
    .style("text-anchor", "middle")
    .text(function (d) {
        return d.data.Name;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", function (d) {
        return d.r / 5;
    })
    .attr("fill", "black");

node.append("text")
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
    .text(function (d) {
        return "";
    })
    .attr("font-family", "Gill Sans", "Gill Sans MT")
    .attr("font-size", function (d) {
        return d.r / 5;
    })
    .attr("fill", "white");

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

barChart("Pain");

d3.selectAll(".node")
    .on("click", function (d, i) {
        d3.select(".bar-chart").remove();
        var current_topic = d.data.Name;
        d3.select(".StreamText").text("Monthly trends of Question and Answers that includes " + current_topic);
        d3.select(".QuestionText").text("Question Keywords of " + current_topic);
        d3.select(".AnswerText").text("Answer Keywords of " + current_topic);
        d3.select(".HelpfulnessText").text("Helpfulness");
        d3.select(".AnswersText").text("Answers");
        d3.select(".VotesText").text("Votes");

        barChart(current_topic);
    })
    .on("mouseover", function (d, i) {
        d3.select(this).select("circle").attr("r", 60);
        d3.select(this)
            .select("text")
            .attr("font-size", function (d) {
                return 20;
            });
        d3.select(this).moveToFront();
    })
    .on("mouseout", function (d, i) {
        d3.select(this).select("circle").attr("r", d.r);
        d3.select(this)
            .select("text")
            .attr("font-size", function (d) {
                return d.r / 5;
            });
    });

d3.select(self.frameElement).style("height", diameter + "px");

// wordcloud.js start
windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
};

width = windowWidth - margin.left - margin.right;
height = windowHeight - margin.bottom - margin.top;

let stopwords = [
    "a",
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "am",
    "an",
    "and",
    "any",
    "are",
    "aren't",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "below",
    "between",
    "both",
    "but",
    "by",
    "can't",
    "cannot",
    "could",
    "couldn't",
    "did",
    "didn't",
    "do",
    "does",
    "doesn't",
    "doing",
    "don't",
    "down",
    "during",
    "each",
    "few",
    "for",
    "from",
    "further",
    "had",
    "hadn't",
    "has",
    "hasn't",
    "have",
    "haven't",
    "having",
    "he",
    "he'd",
    "he'll",
    "he's",
    "her",
    "here",
    "here's",
    "hers",
    "herself",
    "him",
    "himself",
    "his",
    "how",
    "how's",
    "i",
    "i'd",
    "i'll",
    "i'm",
    "i've",
    "if",
    "in",
    "into",
    "is",
    "isn't",
    "it",
    "it's",
    "its",
    "itself",
    "let's",
    "me",
    "more",
    "most",
    "mustn't",
    "my",
    "myself",
    "no",
    "nor",
    "not",
    "of",
    "off",
    "on",
    "once",
    "only",
    "or",
    "other",
    "ought",
    "our",
    "ours",
    "ourselves",
    "out",
    "over",
    "own",
    "same",
    "shan't",
    "she",
    "she'd",
    "she'll",
    "she's",
    "should",
    "shouldn't",
    "so",
    "some",
    "such",
    "than",
    "that",
    "that's",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "there's",
    "these",
    "they",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "this",
    "those",
    "through",
    "to",
    "too",
    "under",
    "until",
    "up",
    "very",
    "was",
    "wasn't",
    "we",
    "we'd",
    "we'll",
    "we're",
    "we've",
    "were",
    "weren't",
    "what",
    "what's",
    "when",
    "when's",
    "where",
    "where's",
    "which",
    "while",
    "who",
    "who's",
    "whom",
    "why",
    "why's",
    "with",
    "won't",
    "would",
    "wouldn't",
    "you",
    "you'd",
    "you'll",
    "you're",
    "you've",
    "your",
    "yours",
    "yourself",
    "yourselves",
];

function getWordCounts(data) {
    let cleaned_data = data.replace(/[(),.!?<>\-_\/\+:]/g, ""); // !?.,@#$%&"\[\]|()“”:/-_\+
    let text = cleaned_data.toLowerCase();
    // document.getElementById("corpus").innerHTML = text;

    let words = text
        .split(" ")
        .map(function (x) {
            return x.trim();
        }) // trim out excessive spaces around words
        .filter(function (x) {
            return !!x;
        }) // remove empty strings
        .filter(function (x) {
            return !(stopwords.indexOf(x) >= 0);
        }) // remove stopwords
        .filter(function (x) {
            return x.length > 2;
        }); // remove single or double character words

    let counts = {};
    for (var i = 0; i < words.length; i++) {
        counts[words[i]] = 1 + (counts[words[i]] || 0);
    }
    var arr = [];
    for (var key in counts) {
        arr.push({
            text: key,
            count: counts[key],
        });
    }

    var res = arr.filter(function (x) {
        return x.count > 1 && x.count < 20;
    });
    return res;
}

// Make the word cloud

function drawCloudQ(words) {
    // console.log(words);
    d3.selectAll("#questionwcsvg").remove();

    var fill = d3.scaleOrdinal([
        `#dceefa`,
        `#a8d6f3`,
        `#97cef1`,
        `#74beec`,
        `#52ade7`,
        `#2f9de2`,
        `#1a7ebd`,
        `#135b89`,
    ]);
    var xScale = d3.scaleLinear().range([0, width]);
    //alert("tillsvg")
    var svg = d3
        .select("#questionwcdiv")
        .append("svg")
        .attr("id", "questionwcsvg")
        .attr("width", "500")
        .attr("height", "500");

    var chartGroup = svg.append("g").attr("transform", "translate(250,250)");
    chartGroup
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("fill", function (d, i) {
            return fill(i);
        })
        .style("font-size", function (d) {
            return d.size + "px";
        })
        .attr("transform", function (d) {
            return "translate(" + [+d.x, +d.y] + ")rotate(" + d.rotate + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.text;
        });
}

function drawCloudA(words) {
    // console.log(words);
    d3.selectAll("#answerwcsvg").remove();

    var fill = d3.scaleOrdinal([
        `#dceefa`,
        `#a8d6f3`,
        `#97cef1`,
        `#74beec`,
        `#52ade7`,
        `#2f9de2`,
        `#1a7ebd`,
        `#135b89`,
    ]);
    var xScale = d3.scaleLinear().range([0, width]);
    //alert("tillsvg")
    var svg = d3
        .select("#answerwcdiv")
        .append("svg")
        .attr("id", "answerwcsvg")
        .attr("width", "500")
        .attr("height", "500");

    var chartGroup = svg.append("g").attr("transform", "translate(250,250)");
    chartGroup
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("fill", function (d, i) {
            return fill(i);
        })
        .style("font-size", function (d) {
            return d.size + "px";
        })
        .attr("transform", function (d) {
            return "translate(" + [+d.x, +d.y] + ")rotate(" + d.rotate + ")";
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.text;
        });
}

function barChart(current_topic) {
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x0 = d3version2.scale.ordinal().rangeRoundBands([0, width], 0.1);

    var x1 = d3version2.scale.ordinal();

    var y = d3version2.scale.linear().range([height, 0]);

    var xAxis = d3version2.svg.axis().scale(x0).tickSize(0).orient("bottom");

    var yAxis = d3version2.svg.axis().scale(y).orient("left");

    var color = d3version2.scale.ordinal().range(["#fce205", "#ddd"]);

    var svg = d3version2
        .select(".chartStream")
        .append("svg")
        .attr("class", "bar-chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    d3.json("./Question-Corpus/" + current_topic + ".json", function (error, data) {
        var categoriesNames = data.map(function (d) {
            return d.categorie;
        });
        var rateNames = data[0].values.map(function (d) {
            return d.rate;
        });

        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([
            0,
            d3.max(data, function (categorie) {
                return d3.max(categorie.values, function (d) {
                    return d.value;
                });
            }),
        ]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style("opacity", "0")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-weight", "bold")
            .text("Value");

        svg.select(".y").transition().duration(100).delay(300).style("opacity", "1");

        var slice = svg
            .selectAll(".slice")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "g")
            .attr("transform", function (d) {
                return "translate(" + x0(d.categorie) + ",0)";
            });

        slice
            .selectAll("rect")
            .data(function (d) {
                return d.values;
            })
            .enter()
            .append("rect")
            .attr("width", 30)
            .attr("x", function (d, i) {
                return i * 30 + 45;
            })
            .style("fill", function (d) {
                return color(d.rate);
            })
            .attr("y", function (d) {
                return y(0);
            })
            .attr("height", function (d) {
                return height - y(0);
            })
            .on("mouseover", function (d) {
                d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
            })
            .on("mouseout", function (d) {
                d3.select(this).style("fill", color(d.rate));
            });

        slice
            .selectAll("rect")
            .transition()
            .delay(function (d) {
                return Math.random() * 1000;
            })
            .duration(1000)
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            });

        //Legend
        var legend = svg
            .selectAll(".legend")
            .data(
                data[0].values
                    .map(function (d) {
                        return d.rate;
                    })
                    .reverse()
            )
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .style("opacity", "0");

        legend
            .append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function (d) {
                return color(d);
            });

        legend
            .append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

        legend
            .transition()
            .duration(500)
            .delay(function (d, i) {
                return 1300 + 100 * i;
            })
            .style("opacity", "1");
    });
}
