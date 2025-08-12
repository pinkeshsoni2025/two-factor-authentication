package com.jmendoza.springboot.twofa.model;

import javax.persistence.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    private String username;
    private String fullname;
	private String password;
    private String secret;
    
    private String bio;
    
	private Boolean mfa;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

   
	@Column(name = "created_by", nullable = false)
    private String createdBy;

    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;

    @Column(name = "updated_by",  nullable = true)
    private String updatedBy;
   
    public User() {
    }
    
    public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }
    
    public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public Boolean getMfa() {
		return mfa;
	}

	public void setMfa(Boolean mfa) {
		this.mfa = mfa;
	}
	
	 public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

}
