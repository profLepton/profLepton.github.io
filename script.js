var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var cw = canvas.width = 500;
var ch = canvas.height = 500;



const width = 500;
const height = 500;


const R1 = 0.5;
const R2 = 1;
const K2 = 200;

const K1 = width * K2 * 3 / (8 * (R1 + R2));



function draw() {

    const time = new Date();
    const radians = ((Math.PI/60) * time.getSeconds() + (Math.PI/60000) * time.getMilliseconds())*10;
    output = getColors(radians, radians);


    ctx.clearRect(0, 0, cw, ch);
    
    for (let i=0; i<width; i++){
        for (let j=0; j<height; j++){
        let o = output[i][j]
        ctx.fillStyle = 'rgb(' + o + ',' + o + ',' + o + ')';
        ctx.fillRect(i, j, 1, 1);
        }
    }
    setInterval(draw, 10);
}


function getColors(A, B){
        const theta_spacing = 0.02;
        const phi_spacing = 0.02;
    
    
        var cosA = Math.cos(A);
        var cosB = Math.cos(B);
        var sinA = Math.sin(A);
        var sinB = Math.sin(B);
    
        var output = [];
        var temp;
        for(let i=0; i<width;i++){
            temp = [];
            for(let j=0; j<height; j++){
                temp.push(0);
            }
            output[i] = temp;
        }
        temp = [];
    
        var zbuffer = output;
    
        for(let theta=0; theta < 2 * Math.PI; theta+= theta_spacing){
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
    
            for(let phi=0; phi < 2 * Math.PI; phi+= phi_spacing){
                var cosPhi = Math.cos(phi);
                var sinPhi = Math.sin(phi);
    
                var circlex = R2 + R1 * cosTheta;
                var circley = R1 * sinTheta;
    
                var x = circlex * (cosB * cosPhi + sinA * sinB * sinPhi) - circley * cosA * sinB;
                var y = circlex * (sinB * cosPhi - sinA * cosB * sinPhi) + circley * cosA * cosB;
                var z = K2 + cosA * circlex * sinPhi + circley * sinA;
    
                var ooz = 1 / z;
    
                var xp = Math.floor(width / 2 + K1 * ooz * x);
                var yp = Math.floor(height / 2 - K1 * ooz * y);
    
                var L = cosPhi * cosTheta * sinB - cosA * cosTheta * sinPhi - sinA * sinTheta + cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);
                
                
    
                if(L > 0){
                    var luminance_index = L;
                    if(ooz > zbuffer[xp][yp]){
                        zbuffer[xp][yp] = ooz;
                        output[xp][yp] = luminance_index* 255;
                        
                        
                        
                    }
                }
            }
            
            
        }
        return output;
    }
    


draw();
