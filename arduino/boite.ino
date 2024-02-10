
volatile bool val = false;
volatile bool val1 = false;
bool preced = false;

int cpt = 0;
void setup(void) {
    Serial.begin(9600);
    attachInterrupt(digitalPinToInterrupt(2),ouverture,FALLING);
    attachInterrupt(digitalPinToInterrupt(3),fermeture,RISING);
    pinMode(2,INPUT);
    pinMode(3,INPUT);
    pinMode(6,OUTPUT);
    digitalWrite(6, LOW);
}

void loop() {

  if(int(Serial.read()) == 'o'){
     Serial.println("ouverture");
     digitalWrite(6, HIGH);
     delay(1000);
     digitalWrite(6,LOW);
  }

  
  if(val){
    if(!preced){
      Serial.println("{\"ouverture\":true}");
      preced = true;
    }
    
    val = false;
  }

  if(val1){
    if(preced){
      Serial.println("{\"ouverture\":false}");
      preced = false;
    }
    
    val1 = false;
  }


};


void ouverture(){
  val = true;
}

void fermeture(){
  val1 = true;
}


