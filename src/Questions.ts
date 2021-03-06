import * as fs from 'fs';
import * as readline from 'readline';
import * as xml2json from 'xml2json';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type XmlBoolean = 'True' | 'False';

interface Run {
  Run: {
    version: string;
    GameIcon: {};
    GameName: string;
    CategoryName: string;
    Metadata: {
      Run: { id: string };
      Platform: { usesEmulator: XmlBoolean; $t: string };
      Region: string;
      Variables: { Variable: { name: 'Quicksaves'; $t: 'Yes' | 'No' } };
    };
    Offset: string;
    AttemptCount: string;
    AttemptHistory: {
      Attempt: {
        id: string;
        started: string;
        isStartedSynced: XmlBoolean;
        ended: string;
        isEndedSynced: XmlBoolean;
        RealTime?: string;
        GameTime?: string;
      }[];
    };
    Segments: {
      Segment: {
        Name: string;
        Icon: {};
        SplitTimes: {
          SplitTime: { name: string; RealTime: string; GameTime: string };
        };
        BestSegmentTime: { RealTime: string; GameTime: string };
        SegmentHistory: { Time: any[] };
      }[];
    };
    AutoSplitterSettings: {};
  };
}

export default class Questions {
  _from: 'l' | 'r' | undefined = 'l';
  initialQuestion(): void {
    /*rl.question(
      'Do you want to convert from LiveSplit to rift [l] or other way round [r]? [l|r] ',
      this.conversion.bind(this)
    );*/
    rl.question('Enter an input file: ', this.fileEntered.bind(this));
  }
  private conversion(answer?: string): void {
    if (answer)
      switch (answer.toLowerCase()) {
        case 'l':
        case 'livesplit':
          this._from = 'l';
          break;
        case 'r':
        case 'rift':
          this._from = 'r';
          break;
        default:
          console.error(`${answer} is not a valid answer`);
          this.initialQuestion();
          return;
      }
    rl.question('Enter an input file: ', this.fileEntered.bind(this));
  }

  fileEntered(answer: string): void {
    if (!fs.existsSync(answer)) {
      console.error('This file does not exist');
      this.conversion();
      return;
    }

    switch (this._from) {
      case 'l':
        const run: Run = JSON.parse(
          xml2json.toJson(fs.readFileSync(answer, 'utf-8'))
        );
        let result: string = '{Chapter 1} {\n';
        let chapter: number = 1;
        let inChapter: boolean = true;
        for (let i: number = 0; i < run.Run.Segments.Segment.length; i++) {
          const segment = run.Run.Segments.Segment[i];
          if (segment.Name.startsWith('{Chapter ')) {
            segment.Name = segment.Name.replace(/{Chapter \d+} /, '');
            inChapter = false;
            chapter++;
          }
          if (segment.Name.includes(' '))
            result += `\t{${segment.Name.replace(/^-/, '')}}`;
          else result += `\t${segment.Name.replace(/^-/, '')}`;
          let time: string = segment.SplitTimes.SplitTime.GameTime;
          while (time.match(/^[0:]/)) time = time.substr(1);
          result += ` ${time}\n`;
          if (!inChapter && i !== run.Run.Segments.Segment.length - 1) {
            result += `}\n{Chapter ${chapter}} {\n`;
            inChapter = true;
          }
        }
        fs.writeFile(
          './rift-splits',
          result.replace(/$/, '}'),
          (err: NodeJS.ErrnoException) => {
            if (err) console.error(err);
          }
        );
        console.log(
          `Completed conversion of LiveSplit file ${answer} to rift file ./rift-splits`
        );
        rl.close();
        break;
      case 'r':
        throw new Error('Not implemented yet');
      default:
        console.error(
          `An error occured: this._from is ${this._from}. Please create an issue on the GitHub repository`
        );
        this.initialQuestion();
        return;
    }
  }
}
