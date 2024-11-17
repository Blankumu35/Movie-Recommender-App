
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';



const Rating = ({value, maxValue, textSize, pathColor, textColor, trailColor, backgroundColor, backgroundPadding}) => {

    return(
            <div className='w-20 h-20 text-[20px] mb-5'>
                  <CircularProgressbar 
                    value={`${value}`} 
                    maxValue={maxValue} 
                    text={`${value.toFixed(0)}%`} 
                    background={true} 
                    backgroundPadding={backgroundPadding}  
                    styles={buildStyles({
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'round',

                            // Text size
                            textSize: textSize,

                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 1,

                            // Colors
                            pathColor: pathColor,
                            textColor: textColor,
                            trailColor: trailColor,
                            backgroundColor: backgroundColor,
                    })}
                  />
                </div>
    );
}
export default Rating;