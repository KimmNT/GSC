import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
// import {Picker} from '@react-native-picker/picker';
import clubsData from '../../databases/clubInfor.json';
import BackArrow from './BackArrow';

//IMAGE
import BackGround from '../../../assets/images/background.png';

export default function Submit({navigation}) {
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedMember, setSelectedMember] = useState('');

  const handleClubChange = clubName => {
    setSelectedClub(clubName);
    setSelectedTeam('');
    setSelectedMember('');
  };

  const handleTeamChange = teamName => {
    setSelectedTeam(teamName);
    setSelectedMember('');
  };

  const handleMemberChange = memberName => {
    setSelectedMember(memberName);
  };

  const getTeamsByClub = () => {
    const club = clubsData.clubs.find(club => club.club_name === selectedClub);
    return club ? club.teams : [];
  };

  const getMembersByTeam = () => {
    const teams = getTeamsByClub();
    const team = teams.find(team => team.team_name === selectedTeam);
    return team ? team.members : [];
  };

  const handleSubmit = () => {
    Alert.alert('Double check!', 'Do you want to save ?', [
      {text: 'Cancel', onPress: () => console.log('Cancel save')},
      {text: 'OK', onPress: () => navigation.navigate('Success')},
    ]);
  };

  return (
    <View style={styles.container}>
      <Image source={BackGround} style={styles.background} />
      <SafeAreaView>
        <View style={styles.content}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackArrow />
            </TouchableOpacity>
            <Text style={styles.header__text}>Submit your data</Text>
          </View>

          {/* CONTENT */}
          <View style={styles.submit__container}>
            {/* ACADEMY/CLUB */}
            <View style={styles.dropdown}>
              <Text style={styles.label}>Choose your academy/club:</Text>
              <View style={styles.dropdown__detail}>
                <Picker
                  style={styles.picker}
                  selectedValue={selectedClub}
                  onValueChange={handleClubChange}>
                  <Picker.Item
                    label="Academy / Club"
                    value=""
                    style={{color: '#FFF'}}
                  />
                  {clubsData.clubs.map(club => (
                    <Picker.Item
                      key={club.club_name}
                      label={club.club_name}
                      value={club.club_name}
                      style={styles.picker__item}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            {/* CLASS/TEAM */}
            {selectedClub !== '' && (
              <View style={styles.dropdown}>
                <Text style={styles.label}>Choose your class/team:</Text>
                <View style={styles.dropdown__detail}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedTeam}
                    onValueChange={handleTeamChange}>
                    <Picker.Item
                      label="Class / Team"
                      value=""
                      style={{color: '#FFF'}}
                    />
                    {getTeamsByClub().map(team => (
                      <Picker.Item
                        key={team.team_name}
                        label={team.team_name}
                        value={team.team_name}
                        style={styles.picker__item}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
            {/* NAME */}
            {selectedTeam !== '' && (
              <View style={styles.dropdown}>
                <Text style={styles.label}>Choose your name:</Text>
                <View style={styles.dropdown__detail}>
                  <Picker
                    style={styles.picker}
                    selectedValue={selectedMember}
                    onValueChange={handleMemberChange}>
                    <Picker.Item
                      label="Member's name"
                      value=""
                      style={{color: '#FFF'}}
                    />
                    {getMembersByTeam().map(member => (
                      <Picker.Item
                        key={member.name}
                        label={member.name}
                        value={member.name}
                        style={styles.picker__item}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            )}
            {/* BUTTON */}
            <TouchableOpacity style={styles.submit__btn} onPress={handleSubmit}>
              <Text style={styles.submit__btn_text}>save your data</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  background: {
    position: 'absolute',
    zIndex: -1,
  },
  content: {
    padding: 15,
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header__text: {
    fontSize: 25,
    fontWeight: 900,
    color: '#FFF',
  },
  submit__container: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 10,
    marginTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  dropdown: {
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#242526',
    marginBottom: 30,
  },
  label: {
    color: '#242526',
    fontWeight: 600,
    fontSize: 15,
  },
  picker__item: {
    color: '#242526',
    backgroundColor: '#fff',
  },
  submit__btn: {
    alignItems: 'center',
    marginTop: 50,
  },
  submit__btn_text: {
    backgroundColor: '#E79C25',
    textAlign: 'center',
    width: '80%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 17,
    borderRadius: 5,
  },
});
