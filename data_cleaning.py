import numpy as np
import pandas as pd

filepath = "data/netflix.csv"

with open(filepath, 'rb') as f:
    netflix_df = pd.read_csv(f)

#removing all TV Shows
req_df = netflix_df[netflix_df['type'] != "TV Show"]

req_df = req_df[['show_id', 'director', 'cast']]

#removing NAN values
req_df = req_df[req_df['director'].notna()]

#splitting all directors into separate rows 
reshaped = \
(req_df.set_index(req_df.columns.drop('director',1).tolist())
   .director.str.split(',', expand=True)
   .stack()
   .reset_index()
   .rename(columns={0:'director'})
   .loc[:, req_df.columns]
)

#splitting all actors into separate rows
reshaped = \
(reshaped.set_index(reshaped.columns.drop('cast',1).tolist())
   .cast.str.split(',', expand=True)
   .stack()
   .reset_index()
   .rename(columns={0:'cast'})
   .loc[:, reshaped.columns]
)


#remove duplicate pairs and add count column 
final_df = reshaped.groupby(['director','cast']).size().reset_index().rename(columns={0:'count'})


df_1 = final_df[['director']]
df_1 = df_1.rename(columns={'director': 'crew'})
df_2 = final_df[['cast']]
df_2 = df_2.rename(columns={'cast': 'crew'})


df_1_2 = pd.concat([df_1,df_2], ignore_index=True).drop_duplicates().reset_index(drop=True)
df_1_2 = df_1_2.reset_index()

result = final_df.merge(df_1_2, how='left', left_on='cast', right_on ='crew')
result = result.rename(columns={'cast': 'actor','index': 'actor_id'})
result = result.drop(columns=['crew'])

result = result.merge(df_1_2, how='left', left_on='director', right_on ='crew')
result = result.rename(columns={'index': 'director_id'})
result = result.drop(columns=['crew'])

result = result.sort_values(by='count', ascending=False)
result = result.head(50)

result.to_csv('data/graph.csv') 

